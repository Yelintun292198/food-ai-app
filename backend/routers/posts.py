import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from database import get_db
import models

router = APIRouter()

UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# -------------------------------------------
# Upload a Post
# -------------------------------------------
@router.post("/posts/add")
async def create_post(
    user_id: int = Form(...),
    caption: str = Form(""),
    file: UploadFile = File(...)
):
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    db = next(get_db())
    new_post = models.Posts(
        user_id=user_id,
        image_url=f"/uploads/{file_name}",
        caption=caption
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {"message": "Post created", "post": new_post}


# -------------------------------------------
# Serve uploaded images
# -------------------------------------------
@router.get("/uploads/{filename}")
def get_uploaded_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)


# -------------------------------------------
# Community Feed
# -------------------------------------------
@router.get("/posts/feed")
def get_feed():
    db = next(get_db())
    posts = db.query(models.Posts).order_by(models.Posts.created_at.desc()).all()
    return posts


# -------------------------------------------
# Like a Post
# -------------------------------------------
@router.post("/posts/{post_id}/like")
def like_post(post_id: int, user_id: int):
    db = next(get_db())

    existing = (
        db.query(models.PostLikes)
        .filter_by(post_id=post_id, user_id=user_id)
        .first()
    )

    if existing:
        return {"message": "Already liked"}

    like = models.PostLikes(post_id=post_id, user_id=user_id)
    db.add(like)
    db.commit()

    return {"message": "Liked"}


# -------------------------------------------
# Comment on post
# -------------------------------------------
@router.post("/posts/{post_id}/comment")
def comment(post_id: int, user_id: int, comment: str):
    db = next(get_db())
    new_comment = models.PostComments(
        post_id=post_id,
        user_id=user_id,
        comment=comment
    )
    db.add(new_comment)
    db.commit()

    return {"message": "Comment added"}


# -------------------------------------------
# Get Comments
# -------------------------------------------
@router.get("/posts/{post_id}/comments")
def get_comments(post_id: int):
    db = next(get_db())
    comments = (
        db.query(models.PostComments)
        .filter_by(post_id=post_id)
        .order_by(models.PostComments.created_at.asc())
        .all()
    )
    return comments
