from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import json
from typing import List
from sqlalchemy.orm import Session
from schemas import ...
from crud import ...
from auth import ...
from database import ...

router = APIRouter()

@router.post("/prompts/", response_model=schemas.Prompt)
def create_prompt(prompt: schemas.PromptCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_prompt(db=db, prompt=prompt, owner_id=current_user.id, created_by=current_user.username)

@router.get("/prompts/", response_model=List[schemas.Prompt])
def read_prompts(skip: int = 0, limit: int = 100, search: str = None, category: str = None, db: Session = Depends(database.get_db)):
    prompts = crud.get_prompts(db, skip=skip, limit=limit, search=search, category=category)
    return prompts

@router.get("/prompts/{prompt_id}", response_model=schemas.Prompt)
def read_prompt(prompt_id: int, db: Session = Depends(database.get_db)):
    db_prompt = crud.get_prompt(db, prompt_id=prompt_id)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_prompt

@router.put("/prompts/{prompt_id}", response_model=schemas.Prompt)
def update_prompt(prompt_id: int, prompt: schemas.PromptCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_prompt = crud.get_prompt(db, prompt_id)
    if db_prompt is None or db_prompt.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prompt not found or not owned")
    return crud.update_prompt(db=db, prompt_id=prompt_id, prompt=prompt)

@router.delete("/prompts/{prompt_id}", response_model=schemas.Prompt)
def delete_prompt(prompt_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_prompt = crud.get_prompt(db, prompt_id)
    if db_prompt is None or db_prompt.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prompt not found or not owned")
    return crud.delete_prompt(db=db, prompt_id=prompt_id)

@router.post("/prompts/import/")
async def import_prompts(file: UploadFile = File(...), db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    contents = await file.read()
    prompts_data = json.loads(contents)
    for data in prompts_data:
        prompt = schemas.PromptCreate(**data)
        crud.create_prompt(db=db, prompt=prompt, owner_id=current_user.id, created_by=current_user.username)
    return {"message": "Imported successfully"}

@router.get("/prompts/export/")
def export_prompts(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    prompts = db.query(models.Prompt).filter(models.Prompt.owner_id == current_user.id).all()
    return [schemas.Prompt.from_orm(p).dict() for p in prompts]  # Изменено на .dict() для JSON
