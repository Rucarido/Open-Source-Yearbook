'''
from fastapi import FastAPI

app = FastAPI()

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://lemon:2007aakash22@cluster0.bbhijse.mongodb.net/?appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
'''

from auth import ACCESS_TOKEN_EXPIRE_MINUTES

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import os
import shutil
from pathlib import Path
from models import UserCreate, UserInDB, ProfileCreate
from database import users_collection, profiles_collection
from auth import verify_password, get_password_hash, create_access_token, get_current_user

app = FastAPI(title="Yearbook Auth API")

# CORS for React frontend (adjust origins in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],  # React/Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static/uploads directory if it doesn't exist
Path("static/uploads").mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/register", response_model=UserInDB)
async def register(user: UserCreate):
    db_user = users_collection.find_one({"email": user.email})
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user_dict = {"email": user.email, "hashed_password": hashed_password}
    result = users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)  # Extract ID separately
    return UserInDB(**user_dict, id=user_id)  # Pass ID explicitly

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/yearbook", response_model=list[dict])
async def yearbook_page():
    profiles = []
    cursor = profiles_collection.find({})
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        profiles.append(doc)
    return profiles

@app.post("/profile", response_model=dict)
async def create_profile(profile_data: ProfileCreate, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"]
    # Find user id from email
    user_db = users_collection.find_one({"email": user_email})
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = str(user_db["_id"])
    
    profile_dict = profile_data.dict()
    profile_dict["user_id"] = user_id
    profile_dict["email"] = user_email
    
    # Insert new profile
    result = profiles_collection.insert_one(profile_dict)
    
    return {"message": "Profile created successfully", "id": str(result.inserted_id)}

@app.put("/profile/{profile_id}", response_model=dict)
async def update_profile(profile_id: str, profile_data: ProfileCreate, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"]
    from bson import ObjectId
    
    try:
        obj_id = ObjectId(profile_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    # Verify ownership
    existing_profile = profiles_collection.find_one({"_id": obj_id, "email": user_email})
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Profile not found or access denied")

    profile_dict = profile_data.dict()
    # Don't overwrite owner info
    profile_dict["user_id"] = existing_profile["user_id"]
    profile_dict["email"] = user_email
    
    result = profiles_collection.update_one(
        {"_id": obj_id},
        {"$set": profile_dict}
    )
    
    return {"message": "Profile updated successfully"}

@app.get("/profile/me", response_model=list[dict])
async def get_my_profiles(current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"]
    cursor = profiles_collection.find({"email": user_email})
    
    profiles = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        profiles.append(doc)
        
    return profiles

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
             raise HTTPException(status_code=400, detail="File must be an image")
        
        file_location = f"static/uploads/{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the URL
        return {"url": f"http://localhost:8000/{file_location}"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Image upload failed")

@app.delete("/profile/{profile_id}", response_model=dict)
async def delete_profile(profile_id: str, current_user: dict = Depends(get_current_user)):
    user_email = current_user["email"]
    from bson import ObjectId
    
    try:
        obj_id = ObjectId(profile_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    result = profiles_collection.delete_one({"_id": obj_id, "email": user_email})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found or access denied")
        
    return {"message": "Profile deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
