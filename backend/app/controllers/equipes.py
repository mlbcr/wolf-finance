# from fastapi import APIRouter
# from app.schemas import EquipeCreate
# from app.services import cadastrar_equipe

# from uuid import UUID

# router = APIRouter(
#     prefix="/equipes",
#     tags=["equipes"]
# )

# @router.post("/")
# def criar_equipe(equipe: EquipeCreate):
#     return cadastrar_equipe(equipe)

# @router.get("/")
# async def listar_equipes():
#     return {"message": "Lista de equipes"}

# @router.get("/{equipe_id}")
# async def listar_equipe(equipe_id: UUID):
#     return {"equipe_id": equipe_id}