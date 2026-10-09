from auth import ACCESS_TOKEN_EXPIRE_MINUTES

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from io import BytesIO
from pathlib import Path
from uuid import uuid4
from PIL import Image, UnidentifiedImageError
from models import UserCreate, User, ProfileCreate
from database import users_collection, profiles_collection
from auth import verify_password, get_password_hash, create_access_token, get_current_user

app = FastAPI(title="Yearbook Auth API")
BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "static" / "uploads"
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
MAX_IMAGE_DIMENSION = 4096
ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
}
IMAGE_FORMAT_EXTENSIONS = {
    "JPEG": ".jpg",
    "PNG": ".png",
    "GIF": ".gif",
    "WEBP": ".webp",
}

# CORS for React frontend (adjust origins in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],  # React/Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use absolute paths so the API works regardless of the shell's current directory.
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

@app.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db_user = users_collection.find_one({"email": user.email})
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    user_dict = {"email": user.email, "hashed_password": hashed_password}
    result = users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)  # Extract ID separately
    return User(email=user.email, id=user_id)

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
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    try:
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Only JPEG, PNG, GIF, and WebP images are supported")

        contents = await file.read(MAX_UPLOAD_BYTES + 1)
        if not contents:
            raise HTTPException(status_code=400, detail="Image file is empty")
        if len(contents) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Image must be 5 MB or smaller")

        try:
            image = Image.open(BytesIO(contents))
            image.verify()
            image = Image.open(BytesIO(contents))
            extension = IMAGE_FORMAT_EXTENSIONS.get(image.format)
            if not extension:
                raise HTTPException(status_code=400, detail="Unsupported image format")
            if image.width > MAX_IMAGE_DIMENSION or image.height > MAX_IMAGE_DIMENSION:
                raise HTTPException(status_code=400, detail="Image dimensions must be 4096px or smaller")
        except UnidentifiedImageError as exc:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image") from exc

        filename = f"{uuid4().hex}{extension}"
        (UPLOADS_DIR / filename).write_bytes(contents)
        return {"url": f"{str(request.base_url).rstrip('/')}/static/uploads/{filename}"}
    except HTTPException:
        raise
    except OSError as exc:
        raise HTTPException(status_code=500, detail="Image upload failed")
    finally:
        await file.close()

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
