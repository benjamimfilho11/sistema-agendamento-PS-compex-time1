from datetime import date as Date, time as Time

from pydantic import BaseModel, ConfigDict


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