from pymongo import MongoClient

MONGO_URL = "mongodb+srv://banquetAdmin:banquetAdmin123@cluster0.c4dyomz.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URL)

db = client["banquetDB"]
<<<<<<< HEAD
leads_collection = db["leads"]
=======
leads_collection = db["leads"]
events_collection = db["events"]
dishes_collection = db["dishes"]
ingredients_collection = db["ingredients"]
inventory_collection = db["inventory"]
prep_tasks_collection = db["prep_tasks"]
>>>>>>> 98a5c27041215de0b2297d38a2959e5e90e869ca
