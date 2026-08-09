# from fastapi import APIRouter
# from app.schemas import ProjetoCreate
# from app.services import cadastrar_projeto

# from uuid import UUID

# router = APIRouter(
#     prefix="/projetos",
#     tags=["projetos"]
# )

# @router.post("/")
# def criar_projeto(projeto: ProjetoCreate):
#     return cadastrar_projeto(projeto)

# @router.get("/")
# async def listar_projetos():
#     return {"message": "Lista de projetos"}

# @router.get("/{projeto_id}")
# async def listar_projeto(projeto_id: UUID):
#     return {"projeto_id": projeto_id}