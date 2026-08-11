import sqlite3
from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.repositories.horario_repository import (
    buscar_horario_por_id,
    criar_horario,
    deletar_horario,
)
from app.schemas.horario import HorarioCreate, HorarioResponse


router = APIRouter(
    prefix="/api/horarios",
    tags=["Horários"],
)

@router.post(
    "",
    response_model=HorarioResponse,
    status_code=status.HTTP_201_CREATED,
)
def cadastrar_horario(horario: HorarioCreate):
    inicio = datetime.combine(
        horario.date,
        horario.startTime,
    )

    fim = datetime.combine(
        horario.date,
        horario.endTime,
    )

    if fim <= inicio:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O horário final deve ser posterior ao horário inicial.",
        )

    if inicio <= datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível cadastrar um horário no passado.",
        )

    try:
        return criar_horario(horario)

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este horário já foi cadastrado.",
        )

@router.delete(
    "/{horario_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def excluir_horario(horario_id: int):
    horario = buscar_horario_por_id(horario_id)

    if horario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horário não encontrado.",
        )

    if horario["client_id"] is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Não é possível excluir um horário ocupado.",
        )

    deletar_horario(horario_id)