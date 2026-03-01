from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from db import inventory_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from db import inventory_collection, db
router = APIRouter()

# ================= MODEL ================= #

class InventoryItem(BaseModel):
    item: str
    category: str
    branch: str
    stock: float
    min: float
    unit: str
    expiry: Optional[str] = None
    supplier: Optional[str] = None


# ================= GET ALL ================= #

@router.get("/")
def get_inventory():
    items = list(inventory_collection.find())
    for item in items:
        item["_id"] = str(item["_id"])
    return items


# ================= ADD ================= #

@router.post("/")
def add_inventory(item: InventoryItem):
    obj = item.dict()
    obj["created_at"] = datetime.utcnow()
    result = inventory_collection.insert_one(obj)
    return {"id": str(result.inserted_id)}


# ================= UPDATE ================= #

@router.put("/{item_id}")
def update_inventory(item_id: str, body: dict):
    try:
        oid = ObjectId(item_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID")

    inventory_collection.update_one(
        {"_id": oid},
        {"$set": body}
    )

    return {"message": "Updated"}


# ================= DELETE ================= #

@router.delete("/{item_id}")
def delete_inventory(item_id: str):
    try:
        oid = ObjectId(item_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID")

    inventory_collection.delete_one({"_id": oid})

    return {"message": "Deleted"}

recipes_collection = db["recipes"]


@router.post("/deduct/{event_id}")
def deduct_inventory(event_id: str):

    events_collection = db["events"]

    try:
        event = events_collection.find_one({"_id": ObjectId(event_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid event id")

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    guests = int(event["guests"])
    menu = event["menu"]
    branch = event["branch"]

    for dish in menu:
        recipe = recipes_collection.find_one({"dish": dish})
        if not recipe:
            continue

        for ingredient in recipe["ingredients"]:
            total_needed = ingredient["qty_per_plate"] * guests

            inventory_collection.update_one(
                {
                    "item": ingredient["item"],
                    "branch": branch
                },
                {
                    "$inc": {"stock": -total_needed}
                }
            )

    return {"message": "Inventory deducted successfully"}