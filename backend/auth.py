import asyncio
import threading
import time
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import  HTTPException, Request, status, Depends


cred = credentials.Certificate("./credentials.json")
firebase_admin.initialize_app(cred)

token_cache = {}

class TimeoutError(Exception):
    pass

def verify_with_timeout(token, timeout=10):
    """Run verify_id_token with a timeout"""
    result = {"token": None, "error": None}
    
    def target():
        try:
            result["token"] = auth.verify_id_token(token)
        except Exception as e:
            result["error"] = e
    
    thread = threading.Thread(target=target)
    thread.daemon = True
    thread.start()
    thread.join(timeout)
    
    if thread.is_alive():
        return None, TimeoutError("Token verification timed out")
    if result["error"]:
        return None, result["error"]
    return result["token"], None

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
    
    # Check cache first
    if id_token in token_cache:
        cache_time, decoded_token = token_cache[id_token]
        if time.time() - cache_time < 1800:  # 30 minutes
            return decoded_token
    
    # Verify with timeout
    decoded_token, error = verify_with_timeout(id_token, timeout=15)
    
    if error:
        if isinstance(error, TimeoutError):
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Authentication verification timed out after 15 seconds"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {str(error)}"
            )
    
    # Cache the result
    token_cache[id_token] = (time.time(), decoded_token)
    return decoded_token