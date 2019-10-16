from flask import request
from server.api import get_token
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Users import Users

NS = api.namespace('register',
                   description='Endpoint for registering a new user.')

token = api.model('Token', {
    'token': fields.String
})

form_input = api.model('Register form', {
    'user_name': fields.String,
    'email': fields.String,
    'password': fields.String
})


@NS.route('')
class Register(Resource):
  @api.expect(form_input)
  @api.marshal_with(token)
  def post(self):
    data = request.get_json()
    if data == None:
      data = request.form

    keys = ['user_name', 'email', 'password']
    for key in keys:
      if key not in data:
        return {'message': 'Request missing field: {}'.format(key)}

    for key in data.keys():
      if key not in keys:
        return {'message': 'Invalid key: {}'.format(key)}

    user_name = data['user_name']
    email = data['email']
    password = data['password']
    user = Users(user_name, email, password)
    db.session.add(user)
    db.session.commit()
    return get_token(user_name)
