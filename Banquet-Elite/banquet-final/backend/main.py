from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.inventory import router as inventory_router
from routes.leads import router as leads_router
from routes.kitchen import router as kitchen_router

app = FastAPI()

# ✅ CORS — ONLY ONCE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Banquet API running"}

# ✅ Include routers
app.include_router(inventory_router, prefix="/inventory", tags=["Inventory"])
app.include_router(leads_router, prefix="/leads", tags=["Leads"])
app.include_router(kitchen_router, prefix="/kitchen", tags=["Kitchen"])