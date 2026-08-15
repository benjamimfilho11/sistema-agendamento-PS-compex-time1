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

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                sobrenome TEXT NOT NULL,
                data_nascimento TEXT NOT NULL,
                cpf TEXT NOT NULL UNIQUE,
                telefone TEXT NOT NULL UNIQUE
            )
            """
        )

        connection.commit()

    finally:
        connection.close()


if __name__ == "__main__":
    init_database()
    print("Banco de dados inicializado com sucesso.")