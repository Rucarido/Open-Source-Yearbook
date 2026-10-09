import os
from pymongo import MongoClient

<<<<<<< HEAD
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)
=======
#MONGO_URI = os.getenv("MONGO_URI", <URL>)  # Set env var for security

client = MongoClient(<URL>)
>>>>>>> 80c64b73fb85e5fb7a9273851cd2960f5aa82a03
db = client["yearbook_db"]  # Database name
users_collection = db["users"]
profiles_collection = db["profiles"]
