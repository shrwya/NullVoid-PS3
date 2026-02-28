from fastapi import FastAPI
from routes import leads
from fastapi.middleware.cors import CORSMiddleware
from db import db
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(leads.router)


print(db.list_collection_names())