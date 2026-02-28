from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Query
from db import events_collection, prep_tasks_collection

router = APIRouter(prefix="/kitchen", tags=["kitchen"])


def serialize_doc(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


@router.get("/events-14-days")
async def kitchen_14_day_events():
    """
    Data for the '14-Day Events' tab in the kitchen portal.
    Returns confirmed events in the next 14 days with all fields
    you stored in the events collection (menu, dietary, milestones, etc.).
    """
    today = datetime.utcnow().date()
    end_date = today + timedelta(days=14)

    date_from = today.isoformat()
    date_to = end_date.isoformat()

    cursor = events_collection.find(
        {
            "status": "confirmed",
            "date": {"$gte": date_from, "$lte": date_to},
        }
    ).sort("date", 1)

    events: List[dict] = [serialize_doc(e) for e in cursor]
    return {"events": events}


@router.get("/daily-prep")
async def kitchen_daily_prep(date: Optional[str] = Query(None, description="YYYY-MM-DD")):
    """
    Data for the 'Daily Prep' tab.

    For now, assumes you have documents in `prep_tasks` like:
    {
      "date": "2026-03-15",
      "event_id": "...",
      "dish_id": "...",
      "task_type": "marinate",
      "description": "Marinate 350 portions chicken tikka",
      "portions": 350,
      "estimated_weight": 15,
      "unit": "kg",
      "status": "pending",  // pending | in_progress | done
      "sort_order": 1
    }
    """
    if not date:
        date = datetime.utcnow().date().isoformat()

    cursor = (
        prep_tasks_collection.find({"date": date})
        .sort("sort_order", 1)
    )

    tasks: List[dict] = [serialize_doc(t) for t in cursor]

    total = len(tasks)
    completed = sum(1 for t in tasks if t.get("status") == "done")

    return {
        "date": date,
        "total_tasks": total,
        "completed_tasks": completed,
        "progress": (completed / total) if total else 0,
        "tasks": tasks,
    }