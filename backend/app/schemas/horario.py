from datetime import date as Date, time as Time

from pydantic import BaseModel, ConfigDict, Field


class HorarioCreate(BaseModel):
    date: Date
    startTime: Time
    endTime: Time

    model_config = ConfigDict(extra="forbid")

class HorarioResponse(BaseModel):
    id: int
    date: str
    startTime: str
    endTime: str
    clientId: int | None

class HorarioAgendar(BaseModel):
    clientId: int = Field(gt=0)

    model_config = ConfigDict(extra="forbid")