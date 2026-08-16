from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from app import models
from app.controllers import alunos, equipes, projetos, reunioes, presencas, auth, cursos
import uvicorn

import os

ENV = os.getenv("ENV", "dev")

if ENV == "prod":
    ALLOWED_ORIGINS = [
        "https://gowolffinance.vercel.app",
    ]
else:
    ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "https://gowolffinance.vercel.app",
    ]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(alunos.router)
app.include_router(equipes.router)
app.include_router(projetos.router)
# app.include_router(reunioes.router)
# app.include_router(presencas.router)
app.include_router(auth.router)
app.include_router(cursos.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)