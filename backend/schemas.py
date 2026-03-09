from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class PromptBase(BaseModel):
    title: str
    category: str
    prompt_text: str
    comment: Optional[str] = None
    tags: Optional[List[str]] = None

class PromptCreate(PromptBase):
    pass

class Prompt(PromptBase):
    id: int
    created_by: str
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True
