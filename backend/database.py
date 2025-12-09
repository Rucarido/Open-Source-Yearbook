import os
from pymongo import MongoClient

#MONGO_URI = os.getenv("MONGO_URI", "<mongoDB cluster url")  # Set env var for security

client = MongoClient("<mongoDB cluster url>")
db = client["yearbook_db"]  # Database name
users_collection = db["users"]
