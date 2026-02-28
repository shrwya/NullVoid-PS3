from fastapi import FastAPI
from routes import leads
from routes import events
from routes import kitchen  # NEW
from fastapi.middleware.cors import CORSMiddleware
from db import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads.router)
app.include_router(events.router)
app.include_router(kitchen.router)  # NEW

print(db.list_collection_names())