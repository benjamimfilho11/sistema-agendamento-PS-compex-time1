from app.database.connection import get_connection
from app.schemas.horario import HorarioCreate


def criar_horario(horario: HorarioCreate):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO horarios (
                date,
                start_time,
                end_time,
                client_id
            )
            VALUES (?, ?, ?, NULL)
            """,
            (
                horario.date.isoformat(),
                horario.startTime.strftime("%H:%M"),
                horario.endTime.strftime("%H:%M"),
            ),
        )

        connection.commit()

        return {
            "id": cursor.lastrowid,
            "date": horario.date.isoformat(),
            "startTime": horario.startTime.strftime("%H:%M"),
            "endTime": horario.endTime.strftime("%H:%M"),
            "clientId": None,
        }

    finally:
        connection.close()


def verificar_conflito(date, start_time, end_time):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id FROM horarios
            WHERE date = ?
              AND start_time < ?
              AND end_time > ?
            """,
            (
                date.isoformat(),
                end_time.strftime("%H:%M"),
                start_time.strftime("%H:%M"),
            ),
        )

        return cursor.fetchone() is not None

    finally:
        connection.close()


def buscar_horario_por_id(horario_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, date, start_time, end_time, client_id
            FROM horarios
            WHERE id = ?
            """,
            (horario_id,),
        )

        return cursor.fetchone()

    finally:
        connection.close()


def deletar_horario(horario_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            DELETE FROM horarios
            WHERE id = ?
            """,
            (horario_id,),
        )

        connection.commit()

    finally:
        connection.close()


def agendar_horario(horario_id: int, client_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE horarios
            SET client_id = ?
            WHERE id = ? AND client_id IS NULL
            """,
            (client_id, horario_id),
        )

        connection.commit()

        return cursor.rowcount

    finally:
        connection.close()


def listar_horarios():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, date, start_time, end_time, client_id
            FROM horarios
            """
        )

        return [
            {
                "id": row["id"],
                "date": row["date"],
                "startTime": row["start_time"],
                "endTime": row["end_time"],
                "clientId": row["client_id"],
            }
            for row in cursor.fetchall()
        ]

    finally:
        connection.close()