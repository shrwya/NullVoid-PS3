"""
Branch CRUD endpoints.
Collection: branches
Used by: Staff, Leads, Events, and other modules for branch reference.
"""
import uuid
from datetime import datetime
from copy import deepcopy

from fastapi import APIRouter, HTTPException, Query
from pymongo.errors import DuplicateKeyError

from db import branches_collection
from schemas.branch import BranchCreate, BranchUpdate

router = APIRouter(prefix="/branches", tags=["branches"])


def _doc_to_response(doc: dict):
    """Convert MongoDB document to API response format."""
    if not doc:
        return None
    out = deepcopy(doc)
    out["id"] = str(out.pop("_id", ""))
    return out


# --- CREATE ---
@router.post("", status_code=201)
async def create_branch(payload: BranchCreate):
    """
    Create a new branch.
    branch_id is auto-generated if not provided (format: BR-{8 chars}).
    """
    try:
        data = payload.model_dump(exclude_none=True)

        if not data.get("branch_id"):
            data["branch_id"] = f"BR-{uuid.uuid4().hex[:8].upper()}"

        data["created_at"] = datetime.utcnow()

        result = branches_collection.insert_one(data)
        doc = branches_collection.find_one({"_id": result.inserted_id})
        branch = _doc_to_response(doc)

        return {
            "success": True,
            "data": branch,
            "message": "Branch created successfully",
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "data": None, "message": "branch_id already exists"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )


# --- READ (List) ---
@router.get("")
async def list_branches(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    is_active: bool | None = Query(None, description="Filter by is_active"),
    city: str | None = Query(None, description="Filter by city"),
):
    """
    List branches with optional filters.
    Used by: Owner dashboard, Staff assignment, Lead assignment.
    """
    try:
        filter_q = {}
        if is_active is not None:
            filter_q["is_active"] = is_active
        if city:
            filter_q["city"] = {"$regex": city, "$options": "i"}

        cursor = branches_collection.find(filter_q).sort("created_at", -1).skip(skip).limit(limit)
        branches = [_doc_to_response(d) for d in cursor]
        total = branches_collection.count_documents(filter_q)

        return {
            "success": True,
            "data": {"items": branches, "total": total, "skip": skip, "limit": limit},
            "message": "",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )


# --- READ (Single) ---
@router.get("/{branch_id}")
async def get_branch(branch_id: str):
    """
    Get a single branch by branch_id.
    branch_id is the business identifier (e.g., BR001 or BR-ABC12345).
    """
    try:
        doc = branches_collection.find_one({"branch_id": branch_id})
        if not doc:
            return {
                "success": False,
                "data": None,
                "message": f"Branch not found: {branch_id}",
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
@router.put("/{branch_id}")
async def update_branch(branch_id: str, payload: BranchUpdate):
    """Update branch fields. Only provided fields are updated."""
    try:
        update_data = payload.model_dump(exclude_none=True)
        if not update_data:
            return {
                "success": False,
                "data": None,
                "message": "No fields to update",
            }

        result = branches_collection.find_one_and_update(
            {"branch_id": branch_id},
            {"$set": update_data},
            return_document=True,
        )
        if not result:
            return {
                "success": False,
                "data": None,
                "message": f"Branch not found: {branch_id}",
            }
        return {
            "success": True,
            "data": _doc_to_response(result),
            "message": "Branch updated successfully",
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "data": None, "message": "Duplicate branch_id"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )


# --- DELETE (soft: set is_active=False) ---
@router.delete("/{branch_id}")
async def delete_branch(branch_id: str, hard: bool = Query(False, description="Permanently delete")):
    """
    Soft delete by default (is_active=False).
    Use ?hard=true for permanent deletion.
    """
    try:
        if hard:
            result = branches_collection.delete_one({"branch_id": branch_id})
            if result.deleted_count == 0:
                return {"success": False, "data": None, "message": f"Branch not found: {branch_id}"}
            return {"success": True, "data": None, "message": "Branch permanently deleted"}
        else:
            result = branches_collection.find_one_and_update(
                {"branch_id": branch_id},
                {"$set": {"is_active": False}},
                return_document=True,
            )
            if not result:
                return {"success": False, "data": None, "message": f"Branch not found: {branch_id}"}
            return {
                "success": True,
                "data": _doc_to_response(result),
                "message": "Branch deactivated (soft delete)",
            }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"success": False, "data": None, "message": str(e)},
        )
