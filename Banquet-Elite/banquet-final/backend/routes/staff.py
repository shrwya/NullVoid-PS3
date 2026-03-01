"""
Staff CRUD endpoints.
Collection: staff
References: branches (branch_id)
Used by: Leads (assigned_sales_id), Events, Kitchen, etc.
"""
import uuid
from datetime import datetime
from copy import deepcopy

from fastapi import APIRouter, HTTPException, Query
from pymongo.errors import DuplicateKeyError
from pymongo import ReturnDocument

from db import staff_collection, branches_collection
from schemas.staff import StaffCreate, StaffUpdate

router = APIRouter(prefix="/staff", tags=["staff"])


def _doc_to_response(doc: dict):
    """Convert MongoDB document to API response format."""
    if not doc:
        return None
    out = deepcopy(doc)
    out["id"] = str(out.pop("_id", ""))
    return out


def _ensure_branch_exists(branch_id: str) -> bool:
    """Validate that branch exists before assigning staff."""
    return branches_collection.find_one({"branch_id": branch_id, "is_active": True}) is not None


# --- CREATE ---
@router.post("", status_code=201)
async def create_staff(payload: StaffCreate):
    """
    Create a new staff member.
    staff_id is auto-generated if not provided (format: STF-{8 chars}).
    Validates branch_id exists and is active.
    """
    try:
        if not _ensure_branch_exists(payload.branch_id):
            return {
                "success": False,
                "data": None,
                "message": f"Branch not found or inactive: {payload.branch_id}",
            }

        data = payload.model_dump(exclude_none=True)

        if not data.get("staff_id"):
            data["staff_id"] = f"STF-{uuid.uuid4().hex[:8].upper()}"

        data["created_at"] = datetime.utcnow()

        result = staff_collection.insert_one(data)
        doc = staff_collection.find_one({"_id": result.inserted_id})
        staff = _doc_to_response(doc)

        return {
            "success": True,
            "data": staff,
            "message": "Staff created successfully",
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "data": None, "message": "staff_id already exists"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )


# --- READ (List) ---
@router.get("")
async def list_staff(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    branch_id: str | None = Query(None, description="Filter by branch"),
    role: str | None = Query(None, description="Filter by role (sales/kitchen/property/etc)"),
    is_active: bool | None = Query(None, description="Filter by is_active"),
):
    """
    List staff with optional filters.
    Used by: Owner dashboard, Lead assignment (sales staff), Kitchen scheduling.
    """
    try:
        filter_q = {}
        if branch_id:
            filter_q["branch_id"] = branch_id
        if role:
            filter_q["role"] = role
        if is_active is not None:
            filter_q["is_active"] = is_active

        cursor = staff_collection.find(filter_q).sort("created_at", -1).skip(skip).limit(limit)
        staff_list = [_doc_to_response(d) for d in cursor]
        total = staff_collection.count_documents(filter_q)

        return {
            "success": True,
            "data": {"items": staff_list, "total": total, "skip": skip, "limit": limit},
            "message": "",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )


# --- READ (Single) ---
@router.get("/{staff_id}")
async def get_staff(staff_id: str):
    """
    Get a single staff member by staff_id.
    """
    try:
        doc = staff_collection.find_one({"staff_id": staff_id})
        if not doc:
            return {
                "success": False,
                "data": None,
                "message": f"Staff not found: {staff_id}",
            }
        return {
            "success": True,
            "data": _doc_to_response(doc),
            "message": "",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )


# --- UPDATE ---
@router.put("/{staff_id}")
async def update_staff(staff_id: str, payload: StaffUpdate):
    """Update staff fields. Only provided fields are updated. Validates branch_id if provided."""
    try:
        if payload.branch_id is not None and not _ensure_branch_exists(payload.branch_id):
            return {
                "success": False,
                "data": None,
                "message": f"Branch not found or inactive: {payload.branch_id}",
            }

        update_data = payload.model_dump(exclude_none=True)
        if not update_data:
            return {
                "success": False,
                "data": None,
                "message": "No fields to update",
            }

        result = staff_collection.find_one_and_update(
            {"staff_id": staff_id},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )
        if not result:
            return {
                "success": False,
                "data": None,
                "message": f"Staff not found: {staff_id}",
            }
        return {
            "success": True,
            "data": _doc_to_response(result),
            "message": "Staff updated successfully",
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "data": None, "message": "Duplicate staff_id"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )


# --- DELETE ---
@router.delete("/{staff_id}")
async def delete_staff(staff_id: str, hard: bool = Query(False, description="Permanently delete")):
    """
    Soft delete by default (is_active=False).
    Use ?hard=true for permanent deletion.
    """
    try:
        if hard:
            result = staff_collection.delete_one({"staff_id": staff_id})
            if result.deleted_count == 0:
                return {"success": False, "data": None, "message": f"Staff not found: {staff_id}"}
            return {"success": True, "data": None, "message": "Staff permanently deleted"}
        else:
            result = staff_collection.find_one_and_update(
                {"staff_id": staff_id},
                {"$set": {"is_active": False}},
                return_document=ReturnDocument.AFTER,
            )
            if not result:
                return {"success": False, "data": None, "message": f"Staff not found: {staff_id}"}
            return {
                "success": True,
                "data": _doc_to_response(result),
                "message": "Staff deactivated (soft delete)",
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )
