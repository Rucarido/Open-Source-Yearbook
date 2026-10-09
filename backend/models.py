from urllib.parse import urlparse

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class User(BaseModel):
    id: str
    email: EmailStr

class UserInDB(User):
    hashed_password: str

class ProfileCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=120)
    batch_year: int = Field(ge=1900, le=2200)
    quote: Optional[str] = None
    bio: Optional[str] = None
    social_links: Optional[dict] = None
    photo_url: Optional[str] = None

    @field_validator("photo_url")
    @classmethod
    def validate_photo_url(cls, value: Optional[str]) -> Optional[str]:
        if not value:
            return None
        if urlparse(value).scheme not in {"http", "https"}:
            raise ValueError("photo_url must use http or https")
        return value

    @field_validator("social_links")
    @classmethod
    def validate_social_links(cls, value: Optional[dict]) -> Optional[dict]:
        if not value:
            return value
        for url in value.values():
            if url and (not isinstance(url, str) or urlparse(url).scheme not in {"http", "https"}):
                raise ValueError("social links must use http or https")
        return value

class Profile(ProfileCreate):
    id: str
    user_id: str
    email: EmailStr
