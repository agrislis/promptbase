from sqlalchemy.orm import Session
from sqlalchemy import or_

from models import User as DBUser, Prompt
from schemas import UserCreate, PromptCreate, Prompt
from auth import verify_password, get_password_hash

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = DBUser(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(DBUser).filter(DBUser.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(DBUser).filter(DBUser.email == email).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

# остальные функции CRUD для Prompt остаются без изменений
# (create_prompt, get_prompts, get_prompt, update_prompt, delete_prompt)
