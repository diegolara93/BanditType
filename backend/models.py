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
    stats = relationship("Stats", back_populates="user")

class Stats(Base):
    __tablename__ = "stats"
    
    id = Column(Integer, primary_key=True, index=True)
    averageWPM = Column(Float)
    accuracy = Column(Float)
    highestWPM = Column(Float)
    games_played = Column(Integer, nullable=False, default=0)
    user_id = Column(String(255), ForeignKey("users.uid"))
    user = relationship("User", back_populates="stats")
