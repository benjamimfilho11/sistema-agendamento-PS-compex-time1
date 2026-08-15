import sqlite3

from fastapi import APIRouter, HTTPException, status

from app.repositories.cliente_repositorio import (
    atualizar_cliente,
    criar_cliente,
    deletar_cliente,
    listar_clientes,
)
from app.schemas.cliente import ClienteCreate, ClienteResponse, ClienteUpdate


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


@router.get(
    "",
    response_model=list[ClienteResponse],
)
def listar_clientes_route():
    return listar_clientes()


@router.patch(
    "/{cliente_id}",
    response_model=ClienteResponse,
)
def atualizar_cliente_route(cliente_id: int, cliente: ClienteUpdate):
    try:
        atualizado = atualizar_cliente(cliente_id, cliente)

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este CPF já foi cadastrado.",
        )

    if atualizado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    return atualizado


@router.delete(
    "/{cliente_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def deletar_cliente_route(cliente_id: int):
    deletado = deletar_cliente(cliente_id)

    if deletado == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )