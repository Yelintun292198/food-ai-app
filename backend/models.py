from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Google login fields
    google_id = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)

    # Email is used for login + google
    email = Column(String(255), unique=True, nullable=False)

    # Password only for normal users (Google login users = null)
    password_hash = Column(String(255), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# -----------------------------
# ⭐ NEW TABLE: Recommendations
# -----------------------------
class Recommendations(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)  # simple FK; handled in router
    recipe_name = Column(String(255))
    image_url = Column(String(500))
    reason = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# -----------------------------
# ⭐ NEW TABLE: Community Posts
# -----------------------------
class Posts(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)   # FK to users.id
    image_url = Column(String(500), nullable=False)
    caption = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# -----------------------------
# ⭐ NEW TABLE: Post Likes
# -----------------------------
class PostLikes(Base):
    __tablename__ = "post_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer)   # FK to posts.id
    user_id = Column(Integer)   # FK to users.id
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# -----------------------------
# ⭐ NEW TABLE: Post Comments
# -----------------------------
class PostComments(Base):
    __tablename__ = "post_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer)   # FK to posts.id
    user_id = Column(Integer)   # FK to users.id
    comment = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
