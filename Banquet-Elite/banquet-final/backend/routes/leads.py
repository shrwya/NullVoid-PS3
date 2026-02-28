from fastapi import APIRouter
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