'''Contains class for logging in'''
from flask import request
from flask_restplus import Resource, fields
from server.app import app, api
from server.models.Users import Users
from server.api import get_token

NS = api.namespace("login", description="Login an existing user")


# self.user_name = user_name
#     self.email = email
#     self.password_hash = generate_password_hash(password, method='sha256')
#     self.pref_timezone = pref_timezone

token = api.model('Token', {
    'token': fields.String,
    'user_id': fields.String,
    'user_name': fields.String,
    'email': fields.String,
    'pref_timezone': fields.String,
    'learning_id': fields.Integer,
    'learning_language': fields.String,
    'native_id': fields.Integer,
    'native_language': fields.String,
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
    ls_wanted = user.languages_wanted
    ls_known = user.languages_known

    if not user:
      return {"message": "Invalid credentials", 'authenticated': False}

    token = get_token(user_name)
    token["user_id"] = user.id
    token["user_name"] = user.user_name
    token["email"] = user.email

    if len(ls_wanted) > 0:
      l = ls_wanted[0]
      token["learning_id"] = l.id
      token["learning_language"] = l.language.language_name

    if len(ls_known) > 0:
      l = ls_known[0]
      token["native_id"] = l.id
      token["native_language"] = l.language.language_name

    return token
