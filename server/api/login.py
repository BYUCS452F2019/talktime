'''Contains class for logging in'''
from flask import request
from flask_restplus import Resource
from server.app import app, api
from server.models.Users import Users
from server.api import get_token

NS = api.namespace("login", description="Login an existing user")

@NS.route("/")
class Login(Resource):
  '''Contains post method for logging in'''
  def post(self):
    '''Post fields ["user_name", "password"] to log in an existing user'''
    user_name = request.form["user_name"]
    password = request.form["password"]
    user = Users.authenticate(user_name=user_name, password=password)

    if not user:
      return {"message": "Invalid credentials"}

    return get_token(user.email)