from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from database import get_db
import models

router = APIRouter(prefix="/api/community", tags=["Community"])


# =====================
# Schemas
# =====================

class CreatePostRequest(BaseModel):
    user_id: int
    dish_name: str
    dish_image: str
    opinion: str | None = None


class CommentRequest(BaseModel):
    user_id: int
    comment: str


# =====================
# Create Community Post
# =====================

@router.post("/post")
def create_post(request: CreatePostRequest, db: Session = Depends(get_db)):
    post = models.CommunityPost(
        user_id=request.user_id,
        dish_name=request.dish_name,
        dish_image=request.dish_image,
        opinion=request.opinion
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return {"message": "Post created", "post_id": post.id}


# =====================
# Get Community Feed
# =====================

@router.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    posts = (
        db.query(
            models.CommunityPost,
        )
        .order_by(models.CommunityPost.created_at.desc())
        .all()
    )

    result = []
    for post in posts:
        likes_count = (
            db.query(models.PostLike)
            .filter(models.PostLike.post_id == post.id)
            .count()
        )
        comments_count = (
            db.query(models.PostComment)
            .filter(models.PostComment.post_id == post.id)
            .count()
        )

        result.append({
            "id": post.id,
            "dish_name": post.dish_name,
            "dish_image": post.dish_image,
            "opinion": post.opinion,
            "user_id": post.user_id,
            "likes": likes_count,
            "comments": comments_count,
            "created_at": post.created_at,
        })

    return result


# =====================
# Like a Post
# =====================

@router.post("/post/{post_id}/like")
def like_post(post_id: int, user_id: int, db: Session = Depends(get_db)):
    exists = (
        db.query(models.PostLike)
        .filter(
            models.PostLike.post_id == post_id,
            models.PostLike.user_id == user_id
        )
        .first()
    )

    if exists:
        raise HTTPException(status_code=400, detail="Already liked")

    like = models.PostLike(post_id=post_id, user_id=user_id)
    db.add(like)
    db.commit()
    return {"message": "Liked"}


# =====================
# Comment on a Post
# =====================

@router.post("/post/{post_id}/comment")
def comment_post(
    post_id: int,
    request: CommentRequest,
    db: Session = Depends(get_db)
):
    comment = models.PostComment(
        post_id=post_id,
        user_id=request.user_id,
        comment=request.comment
    )
    db.add(comment)
    db.commit()
    return {"message": "Comment added"}
