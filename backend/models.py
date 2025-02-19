from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    uid = Column(String(255), primary_key=True, unique=True)
    username = Column(String(30), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    bio = Column(String(255), nullable=True)
    stats = relationship("Stats", back_populates="user", uselist=False)

class Stats(Base):
    __tablename__ = "stats"
    
    id = Column(Integer, primary_key=True, index=True)
    averageWPM = Column(Float, nullable=False, default=0)
    accuracy = Column(Float)
    highestWPM = Column(Float, nullable=False, default=0)
    games_played = Column(Integer, nullable=False, default=0)
    username = Column(String(30), ForeignKey("users.username"))
    user = relationship("User", back_populates="stats", uselist=False)
