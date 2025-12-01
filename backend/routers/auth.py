from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend import models, database
from backend.auth_utils import hash_password, verify_password
from backend.auth_jwt import create_access_token

router = APIRouter(prefix="/api", tags=["Auth"])


# 🧩 Request Schemas
class RegisterRequest(BaseModel):
    name: str    # use "name" instead of "username"
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# 🧠 Register API
@router.post("/register")
def register_user(request: RegisterRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.Users).filter(models.Users.email == request.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(request.password)

    new_user = models.Users(
        name=request.name,
        email=request.email,
        password_hash=hashed_pw,
        google_id=None
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


# 🔐 Login API
@router.post("/login")
def login_user(request: LoginRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.Users).filter(models.Users.email == request.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Prevent login for Google-only accounts
    if user.password_hash is None:
        raise HTTPException(status_code=400, detail="Please login with Google")

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})

    return {"access_token": token, "name": user.name}
