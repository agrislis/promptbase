from fastapi import FastAPI
from database import engine
from models import Base
from routers import prompts, users

app = FastAPI()

# Создание таблиц БД
Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(prompts.router)
