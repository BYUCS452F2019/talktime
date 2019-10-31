'''
This contains a function for requiring a user to
be logged in to use certain endpoints.
'''
import jwt
from functools import wraps
from flask import request
import jwt
from server.models.Users import Users
from server.app import app, api
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
        api.abort(400, "User not found")
      return func(args[0], user, **kwargs)
    except jwt.ExpiredSignatureError:
      api.abort(403, 'Expired JWT token')
    except jwt.InvalidTokenError as err:
      api.abort(403, 'Invalid token')

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


def verify_request(fields, data):
  '''
    Make sure that the given fields are 
    all present in the data
  '''
  for f in fields:
    if f not in data:
      api.abort(401, 'Missing required param: {}'.format(f))
