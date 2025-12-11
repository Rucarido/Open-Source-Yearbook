import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")  # Set env var for security

client = MongoClient(MONGO_URL)
db = client["yearbook_db"]  # Database name
users_collection = db["users"]
