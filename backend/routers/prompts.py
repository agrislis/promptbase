from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import json
from typing import List
from sqlalchemy.orm import Session

from schemas import PromptBase, PromptCreate, Prompt
from crud import create_prompt, get_prompts, get_prompt, update_prompt, delete_prompt
from auth import get_current_user
from database import get_db

router = APIRouter()

@router.post("/prompts/", response_model=Prompt)
def create_prompt(prompt: PromptCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return create_prompt(db=db, prompt=prompt, owner_id=current_user.id, created_by=current_user.username)

@router.get("/prompts/", response_model=List[Prompt])
def read_prompts(skip: int = 0, limit: int = 100, search: str = None, category: str = None, db: Session = Depends(get_db)):
    prompts = get_prompts(db, skip=skip, limit=limit, search=search, category=category)
    return prompts

@router.get("/prompts/{prompt_id}", response_model=Prompt)
def read_prompt(prompt_id: int, db: Session = Depends(get_db)):
    db_prompt = get_prompt(db, prompt_id=prompt_id)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_prompt

@router.put("/prompts/{prompt_id}", response_model=Prompt)
def update_prompt(prompt_id: int, prompt: PromptCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_prompt = get_prompt(db, prompt_id)
    if db_prompt is None or db_prompt.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prompt not found or not owned")
    return update_prompt(db=db, prompt_id=prompt_id, prompt=prompt)

@router.delete("/prompts/{prompt_id}", response_model=Prompt)
def delete_prompt(prompt_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_prompt = get_prompt(db, prompt_id)
    if db_prompt is None or db_prompt.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prompt not found or not owned")
    return delete_prompt(db=db, prompt_id=prompt_id)

@router.post("/prompts/import/")
async def import_prompts(file: UploadFile = File(...), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    contents = await file.read()
    prompts_data = json.loads(contents)
    for data in prompts_data:
        prompt = PromptCreate(**data)
        create_prompt(db=db, prompt=prompt, owner_id=current_user.id, created_by=current_user.username)
    return {"message": "Imported successfully"}

@router.get("/prompts/export/")
def export_prompts(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    prompts = db.query(Prompt).filter(Prompt.owner_id == current_user.id).all()
    return [Prompt.from_orm(p).dict() for p in prompts]
