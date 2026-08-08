from datetime import date as Date, time as Time

from pydantic import BaseModel, ConfigDict


class HorarioCreate(BaseModel):
    date: Date
    startTime: Time
    endTime: Time

    model_config = ConfigDict(extra="forbid")