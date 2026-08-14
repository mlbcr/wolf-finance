from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.curso import Curso

from database import get_db


router = APIRouter(
    prefix="/cursos",
    tags=["Cursos"]
)


@router.get("/")
def listar_cursos(
    db: Session = Depends(get_db)
):
    cursos = (
        db.query(Curso)
        .order_by(Curso.nome)
        .all()
    )

    return [
        {
            "id": curso.id,
            "nome": curso.nome,
            "sigla": curso.sigla
        }
        for curso in cursos
    ]