'''
This contains a function for requiring a user to
be logged in to use certain endpoints.
'''
import jwt
from functools import wraps
from flask import request
import jwt
from server.models.Users import Users
from server.app import app
from datetime import datetime, timedelta

def token_required(func):
  '''Decorator to indicate that a user must be logged in to use the function'''
  @wraps(func)
  def _verify(*args, **kwargs):
    auth_headers = request.headers.get("Authorization", "").split()

    invalid_msg = {
        "message": "Invalid token. Registeration and / or authentication required",
        "authenticated": False,
    }
    expired_msg = {
        "message": "Expired token. Reauthentication required.",
        "authenticated": False,
    }

    if len(auth_headers) != 2:
      return invalid_msg

    try:
      token = auth_headers[1]
      data = jwt.decode(token, app.config["SECRET_KEY"])
      user = Users.query.filter_by(user_name=data["sub"]).first()
      if not user:
        raise RuntimeError("User not found")
      return func(args[0], user, **kwargs)
    except jwt.ExpiredSignatureError:
      return expired_msg
    except jwt.InvalidTokenError as err:
      print(err)
      return invalid_msg

  return _verify


def get_token(user_name):
  token = jwt.encode(
      {
          "sub": user_name,
          "iat": datetime.utcnow(),
          "exp": datetime.utcnow() + timedelta(minutes=500),
      },
      app.config["SECRET_KEY"],
  )
  return {"token": token.decode("UTF-8"), 'authenticated': True}