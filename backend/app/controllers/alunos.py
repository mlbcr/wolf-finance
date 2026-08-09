from fastapi import APIRouter
from app.schemas.alunos import AlunoCreate
from app.services.aluno import cadastrar_aluno

from uuid import UUID

router = APIRouter(
    prefix="/alunos",
    tags=["Alunos"]
)

@router.post("/")
def criar_aluno(aluno: AlunoCreate):
    return cadastrar_aluno(aluno)

@router.get("/")
async def listar_alunos():
    return {"message": "Lista de alunos"}

@router.get("/{aluno_id}")
async def listar_aluno(aluno_id: UUID):
    return {"aluno_id": aluno_id}