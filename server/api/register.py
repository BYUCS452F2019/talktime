from flask import request
from server.api import get_token
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Users import Users
from server.models.LanguagesKnown import LanguagesKnown
from server.models.LanguagesWanted import LanguagesWanted

NS = api.namespace('register',
                   description='Endpoint for registering a new user.')

token = api.model('Token', {
    'token': fields.String,
    'user_id': fields.String,
    'message': fields.String,
    'authenticated': fields.Boolean
})

form_input = api.model('Register form', {
    'user_name': fields.String,
    'email': fields.String,
    'password': fields.String,
    'pref_timezone': fields.String,
    'native_language': fields.String,
    'pref_language': fields.Integer
})


@NS.route('')
class Register(Resource):
  @api.expect(form_input)
  @api.marshal_with(token)
  def post(self):
    data = request.get_json()
    if data == None:
      data = request.form

    keys = ['user_name', 'email', 'password', 'pref_timezone', 'native_language', 'pref_language']
    for key in keys:
      if key not in data:
        return {'message': 'Request missing field: {}'.format(key), 'authenticated': False}

    for key in data.keys():
      if key not in keys:
        return {'message': 'Invalid key: {}'.format(key), 'authenticated': False}

    user_name = data['user_name']
    email = data['email']
    password = data['password']
    pref_timezone = data['pref_timezone']
    native_language = data['native_language']
    pref_language = data['pref_language']
    user = Users(user_name, email, password, pref_timezone)
    db.session.add(user)
    db.session.commit()
    token = get_token(user_name)
    token['user_id'] = user.id
    return token
