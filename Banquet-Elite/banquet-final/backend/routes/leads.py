from fastapi import APIRouter
<<<<<<< HEAD
from db import db
from bson import ObjectId
from bson.errors import InvalidId

# CREATE ROUTER FIRST
router = APIRouter()

# DB COLLECTION
leads = db["leads"]

STAGE_POINTS = {
    "New": 10,
    "Called": 20,
    "Site Visit": 40,
    "Food Tasting": 60,
    "Advance Paid": 80,
    "Menu Finalized": 90,
}

# ---------- CREATE LEAD ----------
@router.post("/leads")
def create_lead(lead: dict):
    print("🔥 POST HIT", lead)   # ADD THIS LINE

    lead["score"] = STAGE_POINTS.get(lead.get("stage", "New"), 10)
    result = leads.insert_one(lead)

    print("INSERTED:", result.inserted_id)

    return {"message": "Lead added", "id": str(result.inserted_id)}


# ---------- GET LEADS ----------
@router.get("/leads")
def get_leads():
    data = []
    for l in leads.find():
        l["_id"] = str(l["_id"])
        data.append(l)
    return data


# ---------- UPDATE STAGE ----------
@router.put("/leads/{lead_id}/stage")
def update_stage(lead_id: str, data: dict):

    try:
        oid = ObjectId(lead_id)
    except InvalidId:
        return {"error": "Invalid ID"}

    stage = data.get("stage")
    score = STAGE_POINTS.get(stage, 10)

    result = leads.update_one(
        {"_id": oid},
        {"$set": {"stage": stage, "score": score}}
    )


    return {
        "matched": result.matched_count,
        "modified": result.modified_count
    }

=======
from db import leads_collection

router = APIRouter()

# 🔥 ADD CUSTOMER / LEAD
@router.post("/leads")
async def create_lead(lead: dict):

    result = leads_collection.insert_one(lead)

    return {
        "message": "Lead added successfully",
        "id": str(result.inserted_id)
    }
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
