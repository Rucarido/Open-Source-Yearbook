import os
from pymongo import MongoClient

#MONGO_URI = os.getenv("MONGO_URI", <URL>)  # Set env var for security

client = MongoClient(<URL>)
db = client["yearbook_db"]  # Database name
users_collection = db["users"]
profiles_collection = db["profiles"]
