from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import hashlib

from database import users_collection

SECRET_KEY = "your_secret_key"  # Use env var: os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = HTTPBearer()

def verify_password(plain_password, hashed_password):
    # Pre-process plain_password the same way as in get_password_hash
    password_bytes = plain_password.encode('utf-8') if isinstance(plain_password, str) else plain_password
    if len(password_bytes) > 72:
        password_bytes = hashlib.sha256(password_bytes).digest()
    return pwd_context.verify(password_bytes, hashed_password)

def get_password_hash(password):
    password_bytes = password.encode('utf-8') if isinstance(password, str) else password
    if len(password_bytes) > 72:
        password_bytes = hashlib.sha256(password_bytes).digest()
    return pwd_context.hash(password_bytes)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user