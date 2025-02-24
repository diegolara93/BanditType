from fastapi import FastAPI, Depends, HTTPException, WebSocket
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base
import schemas, crud
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)
app = FastAPI()
    

origins = [
    "http://localhost:3000"
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        if self.active_connections == []:
            await websocket.accept()
            self.active_connections.append(websocket)
        else:
            await websocket.close()

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

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
async def get_user(username: str, db: Session = Depends(get_db)):
    user = crud.get_user(db, username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users/", response_model=list[schemas.User])
async def get_users(skip:int=0, limit:int=0, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user(db, user.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    if crud.get_user(db, user.email):
        raise HTTPException(status_code=400, detail="Email already in use")
    return crud.create_user(db, user)
    
@app.get("/users/{username}/stats", response_model=schemas.Stats)
async def get_user_stats(username: str, db: Session = Depends(get_db)):
    return crud.get_user_stats(db, username)

@app.get("/users/{username}/bio")
async def get_bio(username: str, db: Session = Depends(get_db)):
    user = crud.get_user(db, username)
    return user.bio

@app.put("/users/{username}/bio")
async def update_bio(username: str, bio: str, db: Session = Depends(get_db)):
    return crud.update_bio(db, username, bio)

@app.post("/users/{username}/wpm")
async def update_wpm(username: str, wpm: float, db: Session = Depends(get_db)):
    user = crud.update_wpm(db, username, wpm)
    return user.stats

@app.post("/users/{username}/stats") 
async def update_stats(username: str, stats: schemas.Stats, db: Session = Depends(get_db)):
    user = crud.update_stats(db, username, stats)
    return user.stats

@app.get("/users/{uid}/username") 
async def get_username_from_uid(uid: str, db: Session = Depends(get_db)):
    username = crud.get_username_from_id(db, uid)
    return username


# This is for the stats endpoint, seperate into a router later

@app.get("/stats/", response_model=list[schemas.Stats])
async def get_stats(limit:int=0, db: Session = Depends(get_db)):
    topUsers = crud.get_top_stats(db, limit)
    return topUsers

# This is for the websocket used for the typing duel I plan to implement later
@app.websocket("/duel/{username}")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message text was: {data}")
    except Exception  as e:
        print(e)        
    finally:
        await websocket.close()