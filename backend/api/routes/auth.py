from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import os
from utils.config import Settings
from services.supabase_service import SupabaseService

router = APIRouter()
settings = Settings()
supabase_service = SupabaseService()

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    email: str
    full_name: Optional[str] = None
    institution: Optional[str] = None
    is_active: bool = True

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    institution: Optional[str] = None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register", response_model=User)
async def register_user(user: UserCreate):
    """Register a new user"""
    try:
        new_user = supabase_service.register_user(
            email=user.email,
            password=user.password,
            user_data={
                "full_name": user.full_name,
                "institution": user.institution
            }
        )
        return new_user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Generate an access token for the user"""
    try:
        user_token = supabase_service.login_user(
            email=form_data.username,
            password=form_data.password
        )
        return {"access_token": user_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/users/me", response_model=User)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user profile"""
    try:
        user_data = supabase_service.get_user_from_token(token)
        return user_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
