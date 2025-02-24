Making a MonkeyType-like site with NextJS, Python with FastAPI and MySQL.


TODO:
refactor the auth to use onAuthStateChanged from firebase, make sure all post put delete use the Depends(get_current_user) and provides an authorization header