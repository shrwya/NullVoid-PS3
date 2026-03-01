# schemas.py

from pydantic import BaseModel
from datetime import date
from typing import List, Optional


class EventOut(BaseModel):
    id: int
    name: str
    hall: Optional[str]
    date: date
    branch: Optional[str]
    guests: int
    status: str
    menu: Optional[List[str]]
    dietary: Optional[List[str]]

    class Config:
        from_attributes = True  # (for SQLAlchemy)


class PrepChecklistOut(BaseModel):
    id: int
    item: str
    event: Optional[str]
    qty: Optional[str]
    done: bool

    class Config:
        from_attributes = True