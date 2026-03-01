from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from db import leads_collection
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

router = APIRouter()

class LeadModel(BaseModel):
    name: str
    contact: str
    phone: str
    event: str
    guests: int
    budget: int
    branch: str
    stage: Optional[str] = "New"
    eventFrom: Optional[str] = None
    eventTo: Optional[str] = None
    menu: Optional[List[str]] = []

STAGE_POINTS = {
    "New": 10,
    "Called": 20,
    "Site Visit": 40,
    "Food Tasting": 60,
    "Advance Paid": 80,
    "Menu Finalized": 90,
}

@router.post("/")
def create_lead(lead: LeadModel):
    lead_dict = lead.dict()
    lead_dict["score"] = STAGE_POINTS.get(lead.stage, 10)
    lead_dict["created_at"] = datetime.utcnow()

    result = leads_collection.insert_one(lead_dict)

    return {
        "message": "Lead created",
        "id": str(result.inserted_id)
    }

@router.get("/")
def get_leads():
    data = []
    for lead in leads_collection.find():
        lead["_id"] = str(lead["_id"])
        data.append(lead)
    return data

@router.put("/{lead_id}/stage")
def update_stage(lead_id: str, body: dict):
    try:
        oid = ObjectId(lead_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID")

    stage = body.get("stage")

    if not stage:
        raise HTTPException(status_code=400, detail="Stage required")

    score = STAGE_POINTS.get(stage, 10)

    result = leads_collection.update_one(
        {"_id": oid},
        {"$set": {"stage": stage, "score": score}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")

    return {"message": "Stage updated"}