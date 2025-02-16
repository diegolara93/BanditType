import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Header, HTTPException, status, Depends


cred = credentials.Certificate("credentials.json")
firebase_admin.initialize_app(cred)

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header is missing")
    prefix = "Bearer "
    if not authorization.startswith(prefix):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authoirzation Header Format")
    token = authorization[len(prefix):] # removes the prefix bearer
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token")
    