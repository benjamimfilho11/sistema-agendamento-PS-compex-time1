import sqlite3
from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.repositories.horario_repository import criar_horario
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