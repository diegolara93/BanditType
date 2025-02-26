import firebase_admin
from firebase_admin import credentials, auth
from fastapi import  HTTPException, Request, status, Depends


cred = credentials.Certificate("./credentials.json")
firebase_admin.initialize_app(cred)

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header"
        )
    parts = auth_header.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format"
        )
    id_token = parts[1]
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # This dict contains the user's UID and other info
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    