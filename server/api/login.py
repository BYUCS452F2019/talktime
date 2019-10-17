'''Contains class for logging in'''
from flask import request
from flask_restplus import Resource, fields
from server.app import app, api
from server.models.Users import Users
from server.api import get_token

NS = api.namespace("login", description="Login an existing user")

token = api.model('Token', {
    'token': fields.String,
    'message': fields.String,
    'authenticated': fields.Boolean
})

form = api.model('Login form', {
    'user_name': fields.String,
    'password': fields.String
})


@NS.route("")
class Login(Resource):
  '''Contains post method for logging in'''
  @api.expect(form)
  @api.marshal_with(token)
  def post(self):
    '''Post fields ["user_name", "password"] to log in an existing user'''
    data = request.get_json()
    if data == None:
      data = request.form

    keys = ['user_name', 'password']
    for key in keys:
      if key not in data:
        return {'message': 'Missing required param: {}'.format(key), 'authenticated': False}

    for key in data.keys():
      if key not in keys:
        return {'message': 'Invalid param: {}'.format(key)}
    user_name = data["user_name"]
    password = data["password"]
    user = Users.authenticate(user_name=user_name, password=password)

    if not user:
      return {"message": "Invalid credentials", 'authenticated': False}

    return get_token(user_name)
