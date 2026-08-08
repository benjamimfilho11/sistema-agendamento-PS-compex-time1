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