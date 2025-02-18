from sqlalchemy.orm import Session

import models, schemas

def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(username=user.username, email=user.email, bio=user.bio, uid = user.uid)
    db_stats = models.Stats(averageWPM=0, accuracy=0, highestWPM=0, user=db_user)
    db.add(db_user)
    db.add(db_stats)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_stats(db: Session, username: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    return user.stats

def update_bio(db: Session, username: str, bio: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    user.bio = bio
    db.commit()
    db.refresh(user)
    return user

def update_stats(db: Session, username: str, stats: schemas.Stats):
    user = db.query(models.User).filter(models.User.username == username).first()
    user.stats.averageWPM = stats.averageWPM
    user.stats.accuracy = stats.accuracy
    user.stats.highestWPM = stats.highestWPM
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, username: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    db.delete(user)
    db.commit()
    return user

def get_games_played(db: Session, username: str): 
    user = db.query(models.User).filter(models.User.username == username).first()
    return user.games_played