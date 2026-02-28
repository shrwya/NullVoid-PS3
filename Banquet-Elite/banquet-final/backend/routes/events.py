from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, HTTPException
from db import events_collection

router = APIRouter(tags=["events"])


def serialize_event(doc: dict) -> dict:
    """Convert Mongo document to JSON-safe dict."""
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@router.post("/events")
async def create_event(event: dict):
    """
    Create a new event.

    Expected example body:
    {
      "name": "Sharma Wedding",
      "date": "2026-03-15",        // store as YYYY-MM-DD string
      "venue": { "name": "Grand Ballroom", "city": "Andheri" },
      "guest_count": 350,
      "status": "confirmed",       // confirmed | tentative | cancelled
      "size_bucket": "large",
      "menu_status": "finalized",
      "menu_items": [ ... ],
      "dietary_summary": [ ... ],
      "prep_milestones": [ ... ]
    }
    """
    result = events_collection.insert_one(event)
    return {"message": "Event created", "id": str(result.inserted_id)}


@router.get("/events/upcoming")
async def get_upcoming_events():
    """
    Get confirmed events for the next 14 days (for any portal).
    """
    today = datetime.utcnow().date()
    end_date = today + timedelta(days=14)

    # If you store date as 'YYYY-MM-DD' strings, string comparison works
    date_from = today.isoformat()
    date_to = end_date.isoformat()

    cursor = events_collection.find(
        {
            "status": "confirmed",
            "date": {"$gte": date_from, "$lte": date_to},
        }
    ).sort("date", 1)

    events: List[dict] = [serialize_event(e) for e in cursor]
    return {"events": events}