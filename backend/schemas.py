from pydantic import BaseModel

class UserBase(BaseModel):
    username: str
    email: str
    hashed_password: str
    
class StatsBase(BaseModel):
    averageWPM: float = 0
    accuracy: float = 0
    highestWPM: float = 0


class UserCreate(UserBase):
    pass

class StatsCreate(StatsBase):
    pass

class Stats(StatsBase):

    class Config:
        orm_mode = True

class User(UserBase):
    id: int
    stats: Stats

    class Config:
        orm_mode = True
