from app.database.connection import get_connection


def init_database():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS horarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                client_id INTEGER DEFAULT NULL,
                UNIQUE(date, start_time, end_time)
            )
            """
        )

        connection.commit()

    finally:
        connection.close()


if __name__ == "__main__":
    init_database()
    print("Banco de dados inicializado com sucesso.")