from app.database.connection import get_connection
from app.schemas.cliente import ClienteCreate


def criar_cliente(cliente: ClienteCreate):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO clientes (
                nome,
                sobrenome,
                data_nascimento,
                cpf,
                telefone
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                cliente.nome,
                cliente.sobrenome,
                cliente.datanascimento.isoformat(),
                cliente.cpf,
                cliente.telefone,
            ),
        )

        connection.commit()

        return {
            "id": cursor.lastrowid,
            "nome": cliente.nome,
            "sobrenome": cliente.sobrenome,
            "datanascimento": cliente.datanascimento.isoformat(),
            "cpf": cliente.cpf,
            "telefone": cliente.telefone,
        }

    finally:
        connection.close()