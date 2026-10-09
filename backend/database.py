import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)
db = client["yearbook_db"]  # Database name
users_collection = db["users"]
profiles_collection = db["profiles"]
