# from fastapi import APIRouter
# from app.schemas import PresencaCreate
# from app.services import cadastrar_presenca

# from uuid import UUID

# router = APIRouter(
#     prefix="/presencas",
#     tags=["presencas"]
# )

# @router.post("/")
# def criar_presenca(presenca: PresencaCreate):
#     return cadastrar_presenca(presenca)

# @router.get("/")
# async def listar_presencas():
#     return {"message": "Lista de presencas"}

# @router.get("/{presenca_id}")
# async def listar_presenca(presenca_id: UUID):
#     return {"presenca_id": presenca_id}