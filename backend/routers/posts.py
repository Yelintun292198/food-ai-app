import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
import models

router = APIRouter(prefix="/posts", tags=["Posts"])

UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -------------------------------------------
# Upload a Post (IMAGE BASED)
# -------------------------------------------
@router.post("/add")
async def create_post(
    user_id: int = Form(...),
    caption: str = Form(""),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    new_post = models.CommunityPost(
        user_id=user_id,
        dish_name="Uploaded Dish",
        dish_image=f"/uploads/{file_name}",
        opinion=caption
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {
        "message": "Post created",
        "post_id": new_post.id
    }

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
@router.get("/feed")
def get_feed(db: Session = Depends(get_db)):
    posts = (
        db.query(models.CommunityPost)
        .order_by(models.CommunityPost.created_at.desc())
        .all()
    )

    result = []

    for post in posts:
        likes = (
            db.query(models.PostLike)
            .filter(models.PostLike.post_id == post.id)
            .count()
        )

        comments = (
            db.query(models.PostComment)
            .filter(models.PostComment.post_id == post.id)
            .count()
        )

        result.append({
            "id": post.id,
            "dish_name": post.dish_name,
            "dish_image": post.dish_image,
            "opinion": post.opinion,
            "likes": likes,
            "comments": comments,
            "created_at": post.created_at,
        })

    return result

# -------------------------------------------
# Like a Post
# -------------------------------------------
@router.post("/{post_id}/like")
def like_post(
    post_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(models.PostLike)
        .filter_by(post_id=post_id, user_id=user_id)
        .first()
    )

    if existing:
        return {"message": "Already liked"}

    like = models.PostLike(post_id=post_id, user_id=user_id)
    db.add(like)
    db.commit()

    return {"message": "Liked"}

# -------------------------------------------
# Comment on Post
# -------------------------------------------
@router.post("/{post_id}/comment")
def comment_post(
    post_id: int,
    user_id: int,
    comment: str,
    db: Session = Depends(get_db)
):
    new_comment = models.PostComment(
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
@router.get("/{post_id}/comments")
def get_comments(
    post_id: int,
    db: Session = Depends(get_db)
):
    comments = (
        db.query(models.PostComment)
        .filter_by(post_id=post_id)
        .order_by(models.PostComment.created_at.asc())
        .all()
    )

    return comments
