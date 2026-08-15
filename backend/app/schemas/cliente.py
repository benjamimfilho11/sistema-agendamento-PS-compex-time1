from datetime import date as Date

from pydantic import BaseModel, ConfigDict

class ClienteCreate(BaseModel):
    nome: str
    sobrenome: str
    datanascimento: Date
    cpf: str
    telefone: str

    model_config = ConfigDict(extra="forbid")


class ClienteUpdate(BaseModel):
    nome: str
    sobrenome: str
    datanascimento: Date
    cpf: str
    telefone: str

    model_config = ConfigDict(extra="forbid")


class ClienteResponse(BaseModel):
    id: int
    nome: str
    sobrenome: str
    datanascimento: Date
    cpf: str
    telefone: str

