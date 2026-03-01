from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from db import db
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

router = APIRouter()
leads_collection = db["leads"]

# ================= STAGE SCORING ================= #

STAGE_POINTS = {
    "New": 10,
    "Called": 20,
    "Site Visit": 40,
    "Food Tasting": 60,
    "Advance Paid": 80,
    "Menu Finalized": 90,
}

# ================= MODELS ================= #

class LeadModel(BaseModel):
    name: str
    contact: str
    phone: str
    event: str
    guests: int
    budget: int
    branch: str
    stage: str = "New"
    eventFrom: Optional[str] = None
    eventTo: Optional[str] = None
    menu: Optional[List[str]] = []

# ================= CREATE LEAD ================= #

@router.post("/leads")
def create_lead(lead: LeadModel):
    lead_dict = lead.dict()

    # Auto score calculation
    lead_dict["score"] = STAGE_POINTS.get(lead.stage, 10)

    # Add created timestamp
    lead_dict["created_at"] = datetime.utcnow()

    result = leads_collection.insert_one(lead_dict)

    return {
        "message": "Lead created successfully",
        "id": str(result.inserted_id)
    }

# ================= GET ALL LEADS ================= #

@router.get("/leads")
def get_leads():
    leads = []

    for l in leads_collection.find():
        l["_id"] = str(l["_id"])
        leads.append(l)

    return leads

# ================= UPDATE STAGE ================= #

@router.put("/leads/{lead_id}/stage")
def update_stage(lead_id: str, data: dict):

    try:
        oid = ObjectId(lead_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Lead ID")

    stage = data.get("stage")

    if not stage:
        raise HTTPException(status_code=400, detail="Stage is required")

    score = STAGE_POINTS.get(stage, 10)

    result = leads_collection.update_one(
        {"_id": oid},
        {"$set": {"stage": stage, "score": score}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")

    return {"message": "Stage updated successfully"}

# ================= DELETE LEAD (BONUS FEATURE) ================= #

@router.delete("/leads/{lead_id}")
def delete_lead(lead_id: str):

    try:
        oid = ObjectId(lead_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Lead ID")

    result = leads_collection.delete_one({"_id": oid})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")

    return {"message": "Lead deleted successfully"}