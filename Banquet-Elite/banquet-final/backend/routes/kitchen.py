from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/kitchen", tags=["Kitchen"])


# Dummy in-memory data (temporary)
events = [
    {"id": 1, "name": "Wedding Event", "date": "2026-03-10"},
    {"id": 2, "name": "Corporate Party", "date": "2026-03-15"},
]

checklist = [
    {"id": 1, "item": "Prepare starters", "done": False},
    {"id": 2, "item": "Arrange buffet table", "done": False},
]


# ==============================
# GET EVENTS
# ==============================
@router.get("/events")
def get_kitchen_events():
    return events


# ==============================
# GET CHECKLIST
# ==============================
@router.get("/checklist")
def get_prep_checklist():
    return checklist


# ==============================
# TOGGLE CHECKLIST
# ==============================
@router.post("/checklist/{item_id}/toggle")
def toggle_checklist(item_id: int):

    for item in checklist:
        if item["id"] == item_id:
            item["done"] = not item["done"]
            return item

    raise HTTPException(status_code=404, detail="Checklist item not found")