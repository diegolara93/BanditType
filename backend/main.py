from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base
import schemas, crud


Base.metadata.create_all(bind=engine)
app = FastAPI()
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users/{username}")
async def get_user(username: str):
    return {"user_id": username}


@app.get("/users/", response_model=list[schemas.User])
async def get_users(skip:int=0, limit:int=0, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)
    
@app.get("/users/{username}/stats", response_model=schemas.Stats)
async def get_user_stats(username: str, db: Session = Depends(get_db)):
    return crud.get_user_stats(db, username)

@app.get("/users/{username}/bio")
async def get_bio(username: str, db: Session = Depends(get_db)):
    user = crud.get_user(db, username)
    return user.bio


