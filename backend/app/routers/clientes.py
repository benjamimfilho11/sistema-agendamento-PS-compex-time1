import sqlite3

from fastapi import APIRouter, HTTPException, status

from app.repositories.cliente_repositorio import criar_cliente
from app.schemas.cliente import ClienteCreate, ClienteResponse


router = APIRouter(
    prefix="/api/clientes",
    tags=["Clientes"],
)


@router.post(
    "",
    response_model=ClienteResponse,
    status_code=status.HTTP_201_CREATED,
)
def cadastrar_cliente(cliente: ClienteCreate):
    try:
        return criar_cliente(cliente)

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este CPF já foi cadastrado.",
        )