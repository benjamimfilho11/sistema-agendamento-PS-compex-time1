from app.database.connection import get_connection
from app.schemas.cliente import ClienteCreate, ClienteUpdate


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


def listar_clientes():
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, nome, sobrenome, data_nascimento, cpf, telefone
            FROM clientes
            """
        )

        return [
            {
                "id": row["id"],
                "nome": row["nome"],
                "sobrenome": row["sobrenome"],
                "datanascimento": row["data_nascimento"],
                "cpf": row["cpf"],
                "telefone": row["telefone"],
            }
            for row in cursor.fetchall()
        ]

    finally:
        connection.close()


def atualizar_cliente(cliente_id: int, cliente: ClienteUpdate):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE clientes
            SET nome = ?, sobrenome = ?, data_nascimento = ?, cpf = ?, telefone = ?
            WHERE id = ?
            """,
            (
                cliente.nome,
                cliente.sobrenome,
                cliente.datanascimento.isoformat(),
                cliente.cpf,
                cliente.telefone,
                cliente_id,
            ),
        )

        connection.commit()

        if cursor.rowcount == 0:
            return None

        return {
            "id": cliente_id,
            "nome": cliente.nome,
            "sobrenome": cliente.sobrenome,
            "datanascimento": cliente.datanascimento.isoformat(),
            "cpf": cliente.cpf,
            "telefone": cliente.telefone,
        }

    finally:
        connection.close()


def deletar_cliente(cliente_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            UPDATE horarios
            SET client_id = NULL
            WHERE client_id = ?
            """,
            (cliente_id,),
        )

        cursor.execute(
            """
            DELETE FROM clientes
            WHERE id = ?
            """,
            (cliente_id,),
        )

        connection.commit()

        return cursor.rowcount

    finally:
        connection.close()


def buscar_cliente_por_id(cliente_id: int):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id, nome, sobrenome, data_nascimento, cpf, telefone
            FROM clientes
            WHERE id = ?
            """,
            (cliente_id,),
        )

        return cursor.fetchone()

    finally:
        connection.close()