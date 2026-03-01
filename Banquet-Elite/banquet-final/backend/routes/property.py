"""
Property Manager Portal
-----------------------
Covers:
  - Venue CRUD (add, update, list, deactivate)
  - Venue availability checks
  - Staff management (add, list, assign to events)
  - Staff assignment per event
"""

from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from db import events_collection

try:
    from db import venues_collection, staff_collection
except ImportError:
    from db import db
    venues_collection = db["venues"]
    staff_collection = db["staff"]

router = APIRouter(prefix="/property", tags=["Property Manager Portal"])


# ─── Helpers ────────────────────────────────────────────────────────────────

def serialize(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


def get_or_404(collection, doc_id: str, label: str) -> dict:
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Invalid {label} ID format")
    doc = collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail=f"{label} not found")
    return doc


# ─── Venue Management ───────────────────────────────────────────────────────

@router.post("/venues")
async def create_venue(venue: dict):
    """
    Register a new venue/hall.

    Body:
    {
      "name": "Grand Ballroom",
      "city": "Andheri",
      "address": "Plot 12, Andheri West, Mumbai",
      "capacity": 500,
      "amenities": ["AC", "parking", "catering kitchen", "stage"],
      "rental_rate_per_day": 75000,
      "active": true
    }
    """
    venue.setdefault("active", True)
    venue.setdefault("created_at", datetime.utcnow().isoformat())
    result = venues_collection.insert_one(venue)
    return {"message": "Venue created", "id": str(result.inserted_id)}


@router.get("/venues")
async def list_venues(city: str = None, active: bool = True):
    """List all venues, optionally filtered by city."""
    query: dict = {"active": active}
    if city:
        query["city"] = city
    docs = list(venues_collection.find(query).sort("name", 1))
    return {"venues": [serialize(d) for d in docs]}


@router.get("/venues/{venue_id}")
async def get_venue(venue_id: str):
    """Get details for a single venue."""
    return serialize(get_or_404(venues_collection, venue_id, "Venue"))


@router.put("/venues/{venue_id}")
async def update_venue(venue_id: str, updates: dict):
    """Update venue details."""
    doc = get_or_404(venues_collection, venue_id, "Venue")
    updates.pop("_id", None)
    updates.pop("id", None)
    venues_collection.update_one({"_id": doc["_id"]}, {"$set": updates})
    return {"message": "Venue updated"}


@router.patch("/venues/{venue_id}/deactivate")
async def deactivate_venue(venue_id: str):
    """Mark a venue as inactive."""
    doc = get_or_404(venues_collection, venue_id, "Venue")
    venues_collection.update_one({"_id": doc["_id"]}, {"$set": {"active": False}})
    return {"message": "Venue deactivated"}


@router.get("/venues/{venue_id}/availability")
async def check_venue_availability(venue_id: str, date_from: str, date_to: str):
    """
    Check if a venue is free between two dates (inclusive).

    Query params: ?date_from=2026-03-10&date_to=2026-03-15
    Returns list of conflicting confirmed/tentative bookings.
    """
    venue_doc = get_or_404(venues_collection, venue_id, "Venue")
    venue_name = venue_doc.get("name")

    conflicts = list(events_collection.find({
        "venue.name": venue_name,
        "status": {"$in": ["confirmed", "tentative"]},
        "date": {"$gte": date_from, "$lte": date_to},
    }, {"_id": 1, "name": 1, "date": 1, "status": 1}))

    return {
        "venue": venue_name,
        "date_from": date_from,
        "date_to": date_to,
        "available": len(conflicts) == 0,
        "conflicts": [serialize(c) for c in conflicts],
    }


# ─── Staff Management ───────────────────────────────────────────────────────

@router.post("/staff")
async def create_staff(staff: dict):
    """
    Add a staff member.

    Body:
    {
      "name": "Kavita Nair",
      "role": "banquet_captain",     // banquet_captain | waiter | bartender | coordinator | security | housekeeping
      "phone": "9123456780",
      "email": "kavita@elitebanquets.in",
      "hourly_rate": 250,
      "active": true
    }
    """
    staff.setdefault("active", True)
    staff.setdefault("created_at", datetime.utcnow().isoformat())
    result = staff_collection.insert_one(staff)
    return {"message": "Staff member created", "id": str(result.inserted_id)}


@router.get("/staff")
async def list_staff(role: str = None, active: bool = True):
    """List staff, optionally filtered by role."""
    query: dict = {"active": active}
    if role:
        query["role"] = role
    docs = list(staff_collection.find(query).sort("name", 1))
    return {"staff": [serialize(d) for d in docs]}


@router.get("/staff/{staff_id}")
async def get_staff_member(staff_id: str):
    """Get a single staff member's details."""
    return serialize(get_or_404(staff_collection, staff_id, "Staff member"))


@router.put("/staff/{staff_id}")
async def update_staff(staff_id: str, updates: dict):
    """Update a staff member's details."""
    doc = get_or_404(staff_collection, staff_id, "Staff member")
    updates.pop("_id", None)
    updates.pop("id", None)
    staff_collection.update_one({"_id": doc["_id"]}, {"$set": updates})
    return {"message": "Staff member updated"}


@router.patch("/staff/{staff_id}/deactivate")
async def deactivate_staff(staff_id: str):
    """Mark a staff member as inactive."""
    doc = get_or_404(staff_collection, staff_id, "Staff member")
    staff_collection.update_one({"_id": doc["_id"]}, {"$set": {"active": False}})
    return {"message": "Staff member deactivated"}


# ─── Staff Assignments to Events ────────────────────────────────────────────

@router.post("/events/{event_id}/staff/assign")
async def assign_staff_to_event(event_id: str, body: dict):
    """
    Assign one or more staff members to an event.

    Body:
    {
      "assignments": [
        { "staff_id": "<id>", "role_for_event": "banquet_captain", "shift_start": "17:00", "shift_end": "23:00" },
        { "staff_id": "<id>", "role_for_event": "waiter",          "shift_start": "16:00", "shift_end": "22:00" }
      ]
    }
    """
    try:
        event_oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event ID")
    event_doc = events_collection.find_one({"_id": event_oid})
    if not event_doc:
        raise HTTPException(status_code=404, detail="Event not found")

    enriched = []
    for a in body.get("assignments", []):
        staff_doc = get_or_404(staff_collection, a.get("staff_id", ""), "Staff member")
        enriched.append({
            "staff_id": str(staff_doc["_id"]),
            "staff_name": staff_doc.get("name"),
            "role_for_event": a.get("role_for_event"),
            "shift_start": a.get("shift_start"),
            "shift_end": a.get("shift_end"),
            "attendance": "scheduled",  # scheduled | present | absent
        })

    events_collection.update_one(
        {"_id": event_oid},
        {"$push": {"staff_assignments": {"$each": enriched}}}
    )
    return {"message": f"{len(enriched)} staff member(s) assigned to event"}


@router.get("/events/{event_id}/staff")
async def get_event_staff(event_id: str):
    """Get all staff assignments for an event."""
    try:
        oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event ID")
    doc = events_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"staff_assignments": doc.get("staff_assignments", [])}


@router.patch("/events/{event_id}/staff/attendance")
async def update_staff_attendance(event_id: str, body: dict):
    """
    Mark attendance for a staff member on an event.

    Body: { "staff_id": "<id>", "attendance": "present" }  // present | absent
    """
    try:
        oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event ID")
    result = events_collection.update_one(
        {"_id": oid, "staff_assignments.staff_id": body.get("staff_id")},
        {"$set": {"staff_assignments.$.attendance": body.get("attendance")}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Staff assignment not found for this event")
    return {"message": "Attendance updated"}


@router.delete("/events/{event_id}/staff/remove")
async def remove_staff_from_event(event_id: str, body: dict):
    """
    Remove a staff member from an event.

    Body: { "staff_id": "<id>" }
    """
    try:
        oid = ObjectId(event_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid event ID")
    events_collection.update_one(
        {"_id": oid},
        {"$pull": {"staff_assignments": {"staff_id": body.get("staff_id")}}}
    )
    return {"message": "Staff member removed from event"}