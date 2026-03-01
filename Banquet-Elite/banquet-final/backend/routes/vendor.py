from bson import ObjectId
from fastapi import APIRouter, HTTPException
from db import events_collection

try:
    from db import vendors_collection
except ImportError:
    # Fallback: create a vendors_collection reference dynamically
    from db import db
    vendors_collection = db["vendors"]

router = APIRouter(prefix="/vendors", tags=["Vendor Portal"])


# ─── Helpers ────────────────────────────────────────────────────────────────

def serialize(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


def get_vendor_or_404(vendor_id: str) -> dict:
    try:
        oid = ObjectId(vendor_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid vendor ID format")
    doc = vendors_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Vendor not found")
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


# ─── Vendor CRUD ────────────────────────────────────────────────────────────

@router.post("")
async def create_vendor(vendor: dict):
    """
    Register a new vendor/supplier.

    Body:
    {
      "name": "Fresh Farms India",
      "category": "produce",         // produce | dairy | meat | decor | equipment | other
      "contact_name": "Ramesh Shah",
      "phone": "9876543210",
      "email": "ramesh@freshfarms.in",
      "address": "Vashi, Navi Mumbai",
      "active": true
    }
    """
    vendor.setdefault("active", True)
    vendor.setdefault("created_at", __import__("datetime").datetime.utcnow().isoformat())
    result = vendors_collection.insert_one(vendor)
    return {"message": "Vendor created", "id": str(result.inserted_id)}


@router.get("")
async def list_vendors(category: str = None, active: bool = True):
    """List vendors, optionally filtered by category and active status."""
    query: dict = {"active": active}
    if category:
        query["category"] = category
    docs = list(vendors_collection.find(query).sort("name", 1))
    return {"vendors": [serialize(d) for d in docs]}


@router.get("/{vendor_id}")
async def get_vendor(vendor_id: str):
    """Get a single vendor's details."""
    return serialize(get_vendor_or_404(vendor_id))


@router.put("/{vendor_id}")
async def update_vendor(vendor_id: str, updates: dict):
    """Update vendor details (any field except _id)."""
    doc = get_vendor_or_404(vendor_id)
    updates.pop("_id", None)
    updates.pop("id", None)
    vendors_collection.update_one({"_id": doc["_id"]}, {"$set": updates})
    return {"message": "Vendor updated"}


@router.patch("/{vendor_id}/deactivate")
async def deactivate_vendor(vendor_id: str):
    """Soft-delete: mark vendor as inactive."""
    doc = get_vendor_or_404(vendor_id)
    vendors_collection.update_one({"_id": doc["_id"]}, {"$set": {"active": False}})
    return {"message": "Vendor deactivated"}


# ─── Vendor ↔ Event Assignments ─────────────────────────────────────────────

@router.post("/events/{event_id}/assign")
async def assign_vendor_to_event(event_id: str, body: dict):
    """
    Assign a vendor to an event with a specific supply category and expected delivery.

    Body:
    {
      "vendor_id": "<id>",
      "supply_category": "produce",
      "items": ["tomatoes 20kg", "onions 15kg"],
      "expected_delivery": "2026-03-14",
      "delivery_status": "pending"    // pending | delivered | partial | cancelled
    }
    """
    event_doc = get_event_or_404(event_id)
    vendor_doc = get_vendor_or_404(body.get("vendor_id", ""))
    assignment = {
        "vendor_id": str(vendor_doc["_id"]),
        "vendor_name": vendor_doc.get("name"),
        "supply_category": body.get("supply_category"),
        "items": body.get("items", []),
        "expected_delivery": body.get("expected_delivery"),
        "delivery_status": body.get("delivery_status", "pending"),
    }
    events_collection.update_one(
        {"_id": event_doc["_id"]},
        {"$push": {"vendor_assignments": assignment}}
    )
    return {"message": "Vendor assigned to event"}


@router.get("/events/{event_id}/assignments")
async def get_event_vendor_assignments(event_id: str):
    """Get all vendor assignments for an event."""
    doc = get_event_or_404(event_id)
    return {"vendor_assignments": doc.get("vendor_assignments", [])}


@router.patch("/events/{event_id}/delivery")
async def update_delivery_status(event_id: str, body: dict):
    """
    Update delivery status for a specific vendor on an event.

    Body: { "vendor_id": "<id>", "delivery_status": "delivered", "notes": "Arrived at 9am" }
    """
    doc = get_event_or_404(event_id)
    result = events_collection.update_one(
        {"_id": doc["_id"], "vendor_assignments.vendor_id": body.get("vendor_id")},
        {"$set": {
            "vendor_assignments.$.delivery_status": body.get("delivery_status"),
            "vendor_assignments.$.delivery_notes": body.get("notes", ""),
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vendor assignment not found for this event")
    return {"message": "Delivery status updated"}


@router.delete("/events/{event_id}/assign")
async def remove_vendor_from_event(event_id: str, body: dict):
    """
    Remove a vendor assignment from an event.

    Body: { "vendor_id": "<id>" }
    """
    doc = get_event_or_404(event_id)
    events_collection.update_one(
        {"_id": doc["_id"]},
        {"$pull": {"vendor_assignments": {"vendor_id": body.get("vendor_id")}}}
    )
    return {"message": "Vendor assignment removed"}
