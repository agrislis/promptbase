from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import ...
from schemas import ...
from auth import ...

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not auth.verify_password(password, user.hashed_password):
        return False
    return user

def create_prompt(db: Session, prompt: schemas.PromptCreate, owner_id: int, created_by: str):
    db_prompt = models.Prompt(**prompt.dict(), owner_id=owner_id, created_by=created_by)
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    return db_prompt

def get_prompts(db: Session, skip: int = 0, limit: int = 100, search: str = None, category: str = None):
    query = db.query(models.Prompt)
    if search:
        query = query.filter(or_(models.Prompt.title.ilike(f"%{search}%"), models.Prompt.category.ilike(f"%{search}%")))
    if category:
        query = query.filter(models.Prompt.category == category)
    return query.order_by(models.Prompt.created_at.desc()).offset(skip).limit(limit).all()

def get_prompt(db: Session, prompt_id: int):
    return db.query(models.Prompt).filter(models.Prompt.id == prompt_id).first()

def update_prompt(db: Session, prompt_id: int, prompt: schemas.PromptCreate):
    db_prompt = get_prompt(db, prompt_id)
    if db_prompt:
        for key, value in prompt.dict().items():
            setattr(db_prompt, key, value)
        db.commit()
        db.refresh(db_prompt)
    return db_prompt

def delete_prompt(db: Session, prompt_id: int):
    db_prompt = get_prompt(db, prompt_id)
    if db_prompt:
        db.delete(db_prompt)
        db.commit()
    return db_prompt
