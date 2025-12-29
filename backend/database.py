import os
from pymongo import MongoClient

#MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://lemon:2007aakash22@cluster0.nc9dhdl.mongodb.net/?appName=Cluster0")  # Set env var for security

client = MongoClient("mongodb+srv://lemon:2007aakash22@cluster0.bbhijse.mongodb.net/?appName=Cluster0")
db = client["yearbook_db"]  # Database name
users_collection = db["users"]
profiles_collection = db["profiles"]