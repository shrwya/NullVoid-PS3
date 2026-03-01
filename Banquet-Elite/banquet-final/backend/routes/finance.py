"""
Finance Portal
--------------
Covers:
  - Invoice CRUD per event
  - Payment recording & status tracking
  - Revenue summary / dashboard stats
  - Vendor payment tracking
"""

from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from db import events_collection

try:
    from db import invoices_collection
except ImportError:
    from db import db
    invoices_collection = db["invoices"]

router = APIRouter(prefix="/finance", tags=["Finance Portal"])


# ─── Helpers ────────────────────────────────────────────────────────────────

def serialize(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


def get_invoice_or_404(invoice_id: str) -> dict:
    try:
        oid = ObjectId(invoice_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid invoice ID format")
    doc = invoices_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return doc


def get_event_or_404(event_id: str) -> dict:
    try:
        oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event ID format")
    doc = events_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    return doc


# ─── Invoices ───────────────────────────────────────────────────────────────

@router.post("/invoices")
async def create_invoice(invoice: dict):
    """
    Create an invoice for an event.

    Body:
    {
      "event_id": "<id>",
      "event_name": "Sharma Wedding",
      "client_name": "Mr. Rajesh Sharma",
      "client_phone": "9876543210",
      "issue_date": "2026-02-01",
      "due_date": "2026-03-01",
      "line_items": [
        { "description": "Venue rental", "qty": 1, "unit_price": 75000 },
        { "description": "Catering (350 pax)", "qty": 350, "unit_price": 850 }
      ],
      "discount": 5000,
      "tax_percent": 18,
      "status": "unpaid"    // unpaid | partial | paid | overdue | cancelled
    }
    """
    # Auto-calculate totals
    line_items = invoice.get("line_items", [])
    subtotal = sum(item.get("qty", 1) * item.get("unit_price", 0) for item in line_items)
    discount = invoice.get("discount", 0)
    taxable = subtotal - discount
    tax_percent = invoice.get("tax_percent", 0)
    tax_amount = round(taxable * tax_percent / 100, 2)
    total = round(taxable + tax_amount, 2)

    invoice["subtotal"] = subtotal
    invoice["tax_amount"] = tax_amount
    invoice["total_amount"] = total
    invoice["amount_paid"] = 0
    invoice["amount_due"] = total
    invoice.setdefault("status", "unpaid")
    invoice.setdefault("payments", [])
    invoice["created_at"] = datetime.utcnow().isoformat()

    result = invoices_collection.insert_one(invoice)
    return {
        "message": "Invoice created",
        "id": str(result.inserted_id),
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "total_amount": total,
    }


@router.get("/invoices")
async def list_invoices(status: str = None, event_id: str = None):
    """
    List invoices. Optionally filter by status or event_id.

    Query params: ?status=unpaid  or  ?event_id=<id>
    """
    query = {}
    if status:
        query["status"] = status
    if event_id:
        query["event_id"] = event_id
    docs = list(invoices_collection.find(query).sort("issue_date", -1))
    return {"invoices": [serialize(d) for d in docs]}


@router.get("/invoices/{invoice_id}")
async def get_invoice(invoice_id: str):
    """Get a single invoice."""
    return serialize(get_invoice_or_404(invoice_id))


@router.get("/events/{event_id}/invoices")
async def get_event_invoices(event_id: str):
    """Get all invoices linked to a specific event."""
    get_event_or_404(event_id)
    docs = list(invoices_collection.find({"event_id": event_id}).sort("issue_date", -1))
    return {"invoices": [serialize(d) for d in docs]}


@router.put("/invoices/{invoice_id}")
async def update_invoice(invoice_id: str, updates: dict):
    """Update invoice details (e.g. line items, due date). Recalculates totals if line_items provided."""
    doc = get_invoice_or_404(invoice_id)
    updates.pop("_id", None)
    updates.pop("id", None)

    if "line_items" in updates:
        line_items = updates["line_items"]
        subtotal = sum(item.get("qty", 1) * item.get("unit_price", 0) for item in line_items)
        discount = updates.get("discount", doc.get("discount", 0))
        taxable = subtotal - discount
        tax_percent = updates.get("tax_percent", doc.get("tax_percent", 0))
        tax_amount = round(taxable * tax_percent / 100, 2)
        total = round(taxable + tax_amount, 2)
        amount_paid = doc.get("amount_paid", 0)
        updates["subtotal"] = subtotal
        updates["tax_amount"] = tax_amount
        updates["total_amount"] = total
        updates["amount_due"] = round(total - amount_paid, 2)

    invoices_collection.update_one({"_id": doc["_id"]}, {"$set": updates})
    return {"message": "Invoice updated"}


@router.patch("/invoices/{invoice_id}/cancel")
async def cancel_invoice(invoice_id: str):
    """Cancel an invoice."""
    doc = get_invoice_or_404(invoice_id)
    invoices_collection.update_one({"_id": doc["_id"]}, {"$set": {"status": "cancelled"}})
    return {"message": "Invoice cancelled"}


# ─── Payments ───────────────────────────────────────────────────────────────

@router.post("/invoices/{invoice_id}/payments")
async def record_payment(invoice_id: str, body: dict):
    """
    Record a payment against an invoice.

    Body:
    {
      "amount": 50000,
      "method": "bank_transfer",    // bank_transfer | cash | upi | cheque | card
      "reference": "UTR1234567890",
      "date": "2026-02-15",
      "notes": "Advance payment"
    }
    """
    doc = get_invoice_or_404(invoice_id)

    if doc.get("status") == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot record payment on a cancelled invoice")

    payment = {
        "amount": body.get("amount"),
        "method": body.get("method"),
        "reference": body.get("reference", ""),
        "date": body.get("date", datetime.utcnow().date().isoformat()),
        "notes": body.get("notes", ""),
        "recorded_at": datetime.utcnow().isoformat(),
    }

    new_amount_paid = round(doc.get("amount_paid", 0) + body.get("amount", 0), 2)
    total_amount = doc.get("total_amount", 0)
    new_amount_due = round(total_amount - new_amount_paid, 2)

    if new_amount_paid >= total_amount:
        new_status = "paid"
    elif new_amount_paid > 0:
        new_status = "partial"
    else:
        new_status = doc.get("status", "unpaid")

    invoices_collection.update_one(
        {"_id": doc["_id"]},
        {
            "$push": {"payments": payment},
            "$set": {
                "amount_paid": new_amount_paid,
                "amount_due": new_amount_due,
                "status": new_status,
            },
        }
    )
    return {
        "message": "Payment recorded",
        "amount_paid": new_amount_paid,
        "amount_due": new_amount_due,
        "invoice_status": new_status,
    }


@router.get("/invoices/{invoice_id}/payments")
async def get_invoice_payments(invoice_id: str):
    """Get all payments recorded for an invoice."""
    doc = get_invoice_or_404(invoice_id)
    return {
        "invoice_id": invoice_id,
        "total_amount": doc.get("total_amount"),
        "amount_paid": doc.get("amount_paid"),
        "amount_due": doc.get("amount_due"),
        "status": doc.get("status"),
        "payments": doc.get("payments", []),
    }


# ─── Revenue Dashboard ──────────────────────────────────────────────────────

@router.get("/dashboard")
async def finance_dashboard(month: int = None, year: int = None):
    """
    Revenue summary. Defaults to current month/year.

    Query params: ?month=3&year=2026
    """
    now = datetime.utcnow()
    month = month or now.month
    year = year or now.year

    # Build date range for the month
    from calendar import monthrange
    _, last_day = monthrange(year, month)
    date_from = f"{year:04d}-{month:02d}-01"
    date_to = f"{year:04d}-{month:02d}-{last_day:02d}"

    all_invoices = list(invoices_collection.find({
        "issue_date": {"$gte": date_from, "$lte": date_to}
    }))

    total_invoiced = sum(i.get("total_amount", 0) for i in all_invoices)
    total_collected = sum(i.get("amount_paid", 0) for i in all_invoices)
    total_outstanding = sum(i.get("amount_due", 0) for i in all_invoices)

    by_status: dict = {}
    for inv in all_invoices:
        s = inv.get("status", "unknown")
        by_status[s] = by_status.get(s, 0) + 1

    # Events this month
    events_this_month = events_collection.count_documents({
        "date": {"$gte": date_from, "$lte": date_to},
        "status": {"$ne": "cancelled"},
    })

    return {
        "period": f"{year:04d}-{month:02d}",
        "events_count": events_this_month,
        "total_invoiced": total_invoiced,
        "total_collected": total_collected,
        "total_outstanding": total_outstanding,
        "collection_rate_percent": round(total_collected / total_invoiced * 100, 1) if total_invoiced else 0,
        "invoices_by_status": by_status,
    }


@router.get("/overdue")
async def get_overdue_invoices():
    """Get all overdue invoices (due date passed, status not paid/cancelled)."""
    today = datetime.utcnow().date().isoformat()
    docs = list(invoices_collection.find({
        "due_date": {"$lt": today},
        "status": {"$in": ["unpaid", "partial"]},
    }).sort("due_date", 1))

    # Mark as overdue in DB
    ids = [d["_id"] for d in docs]
    if ids:
        invoices_collection.update_many(
            {"_id": {"$in": ids}},
            {"$set": {"status": "overdue"}}
        )

    return {"overdue_invoices": [serialize(d) for d in docs], "count": len(docs)}


# ─── Vendor Payments ────────────────────────────────────────────────────────

@router.post("/vendor-payments")
async def record_vendor_payment(body: dict):
    """
    Record a payment made to a vendor.

    Body:
    {
      "event_id": "<id>",
      "vendor_id": "<id>",
      "vendor_name": "Fresh Farms India",
      "amount": 18000,
      "method": "bank_transfer",
      "reference": "UTR9876543210",
      "date": "2026-03-13",
      "description": "Produce supply for Sharma Wedding",
      "status": "paid"    // paid | pending | cancelled
    }
    """
    body.setdefault("created_at", datetime.utcnow().isoformat())
    body.setdefault("status", "paid")

    try:
        from db import db
        vendor_payments_collection = db["vendor_payments"]
    except Exception:
        raise HTTPException(status_code=500, detail="vendor_payments collection not available")

    result = vendor_payments_collection.insert_one(body)
    return {"message": "Vendor payment recorded", "id": str(result.inserted_id)}


@router.get("/vendor-payments")
async def list_vendor_payments(vendor_id: str = None, event_id: str = None):
    """List vendor payments, optionally filtered by vendor or event."""
    try:
        from db import db
        vendor_payments_collection = db["vendor_payments"]
    except Exception:
        raise HTTPException(status_code=500, detail="vendor_payments collection not available")

    query = {}
    if vendor_id:
        query["vendor_id"] = vendor_id
    if event_id:
        query["event_id"] = event_id
    docs = list(vendor_payments_collection.find(query).sort("date", -1))
    return {"vendor_payments": [serialize(d) for d in docs]}