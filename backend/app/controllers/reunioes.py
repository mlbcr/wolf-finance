# from fastapi import APIRouter
# from app.schemas import reunioesCreate
# from app.services import cadastrar_reunioes

# from uuid import UUID

# router = APIRouter(
#     prefix="/reunioes",
#     tags=["reunioes"]
# )

# @router.post("/")
# def criar_reunioes(reunioes: reunioesCreate):
#     return cadastrar_reunioes(reunioes)

# @router.get("/")
# async def listar_reunioes():
#     return {"message": "Lista de reunioes"}

# @router.get("/{reunioes_id}")
# async def listar_reunioes(reunioes_id: UUID):
#     return {"reunioes_id": reunioes_id}