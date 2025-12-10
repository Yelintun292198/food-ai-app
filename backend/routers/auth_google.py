from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import requests

from database import get_db
from models import Users

router = APIRouter(prefix="/api", tags=["Google Auth"])

@router.post("/google")
def google_login(data: dict, db: Session = Depends(get_db)):
    access_token = data.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Access token missing")

    # 1️⃣ Get user info from Google
    google_info = requests.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    google_id = google_info.get("sub")
    email = google_info.get("email")
    name = google_info.get("name")

    if not email:
        raise HTTPException(status_code=400, detail="Unable to fetch Google account info")

    # 2️⃣ Check if user exists (Google OR normal)
    user = db.query(Users).filter(Users.email == email).first()

    # 3️⃣ Create new Google user
    if not user:
        new_user = Users(
            google_id=google_id,
            name=name,
            email=email,
            password_hash=None  # Google users don't use password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user

    # 4️⃣ Return user
    return {
        "message": "Google login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "google_id": user.google_id
        }
    }
