from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: EmailStr

class UserInDB(User):
    hashed_password: str

class ProfileCreate(BaseModel):
    full_name: str
    batch_year: int
    quote: Optional[str] = None
    bio: Optional[str] = None
    social_links: Optional[dict] = None
    photo_url: Optional[str] = None

class Profile(ProfileCreate):
    id: str
    user_id: str
    email: EmailStr