import sqlite3
from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.repositories.horario_repository import (
    buscar_horario_por_id,
    criar_horario,
    deletar_horario,
    verificar_conflito,
)
from app.schemas.horario import HorarioCreate, HorarioResponse
from app.repositories.cliente_repositorio import buscar_cliente_por_id
from app.repositories.horario_repository import (
    agendar_horario,
    cancelar_agendamento,
    listar_horarios,
    trocar_cliente_horario,
)
from app.schemas.horario import HorarioAgendar, HorarioTrocarCliente


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
    ).replace(tzinfo=None)

    fim = datetime.combine(
        horario.date,
        horario.endTime,
    ).replace(tzinfo=None)

    if fim <= inicio:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O horário final deve ser posterior ao horário inicial.",
        )

    if horario.date < datetime.now().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível cadastrar um horário em uma data passada.",
        )

    if verificar_conflito(horario.date, horario.startTime, horario.endTime):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um horário cadastrado nesse intervalo.",
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


@router.get(
    "",
    response_model=list[HorarioResponse],
)
def listar_horarios_route():
    return listar_horarios()


@router.patch(
    "/{horario_id}/agendar",
    response_model=HorarioResponse,
)
def agendar_horario_route(horario_id: int, agendamento: HorarioAgendar):
    horario = buscar_horario_por_id(horario_id)

    if horario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horário não encontrado.",
        )

    if horario["date"] < datetime.now().date().isoformat():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível agendar um horário em uma data passada.",
        )

    if horario["client_id"] is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este horário já está ocupado.",
        )

    cliente = buscar_cliente_por_id(agendamento.clientId)

    if cliente is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    agendar_horario(horario_id, agendamento.clientId)

    return {
        "id": horario["id"],
        "date": horario["date"],
        "startTime": horario["start_time"],
        "endTime": horario["end_time"],
        "clientId": agendamento.clientId,
    }


@router.patch(
    "/{horario_id}/cancelar",
    response_model=HorarioResponse,
)
def cancelar_horario_route(horario_id: int):
    horario = buscar_horario_por_id(horario_id)

    if horario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horário não encontrado.",
        )

    if horario["client_id"] is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este horário já está livre.",
        )

    cancelar_agendamento(horario_id)

    return {
        "id": horario["id"],
        "date": horario["date"],
        "startTime": horario["start_time"],
        "endTime": horario["end_time"],
        "clientId": None,
    }


@router.patch(
    "/{horario_id}/cliente",
    response_model=HorarioResponse,
)
def trocar_cliente_horario_route(horario_id: int, dados: HorarioTrocarCliente):
    horario = buscar_horario_por_id(horario_id)

    if horario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horário não encontrado.",
        )

    if horario["date"] < datetime.now().date().isoformat():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível alterar o agendamento de um horário em uma data passada.",
        )

    if dados.clientId is not None:
        cliente = buscar_cliente_por_id(dados.clientId)

        if cliente is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente não encontrado.",
            )

    trocar_cliente_horario(horario_id, dados.clientId)

    return {
        "id": horario["id"],
        "date": horario["date"],
        "startTime": horario["start_time"],
        "endTime": horario["end_time"],
        "clientId": dados.clientId,
    }