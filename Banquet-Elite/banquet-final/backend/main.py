from fastapi import FastAPI
<<<<<<< HEAD
from fastapi.middleware.cors import CORSMiddleware

from routes.leads import router as leads_router
=======
from routes import leads
from routes import events
from routes import kitchen  # NEW
from fastapi.middleware.cors import CORSMiddleware
from db import db
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
app.include_router(leads_router)
=======
app.include_router(leads.router)
app.include_router(events.router)
app.include_router(kitchen.router)  # NEW

print(db.list_collection_names())
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
