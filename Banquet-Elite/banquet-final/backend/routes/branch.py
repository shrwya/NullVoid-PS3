"""
Branch schema definitions.
MongoDB collection: branches
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# --- MongoDB document structure (sample) ---
# {
#     "_id": ObjectId("..."),
#     "branch_id": "BR001",
#     "name": "Downtown Banquet Hall",
#     "city": "Mumbai",
#     "manager_name": "Raj Kumar",
#     "contact_number": "+91 9876543210",
#     "is_active": true,
#     "created_at": ISODate("2025-02-28T10:00:00Z")
# }


class BranchCreate(BaseModel):
    """Schema for creating a new branch."""

    name: str = Field(..., min_length=1, max_length=200)
    city: str = Field(..., min_length=1, max_length=100)
    manager_name: str = Field(..., min_length=1, max_length=150)
    contact_number: str = Field(..., min_length=1, max_length=20)
    is_active: bool = True
    branch_id: Optional[str] = Field(None, min_length=1, max_length=20)


class BranchUpdate(BaseModel):
    """Schema for partial branch update."""

    name: Optional[str] = Field(None, min_length=1, max_length=200)
    city: Optional[str] = Field(None, min_length=1, max_length=100)
    manager_name: Optional[str] = Field(None, min_length=1, max_length=150)
    contact_number: Optional[str] = Field(None, min_length=1, max_length=20)
    is_active: Optional[bool] = None


class BranchResponse(BaseModel):
    """Schema for branch in API responses."""

    id: str
    branch_id: str
    name: str
    city: str
    manager_name: str
    contact_number: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
