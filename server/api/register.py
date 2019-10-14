from flask import request
from server.api import get_token
from flask_restplus import Resource
from server.app import api, db
from server.models.Users import Users

NS = api.namespace('register', 
  description='Endpoint for registering a new user.')

@NS.route('/')
class Register(Resource):
  def get(self):
    return 'registering'
  def post(self):
    data = request.form
    user_name = data['user_name']
    email = data['email']
    password = data['password']
    user = Users(user_name, email, password)
    db.session.add(user)
    db.session.commit()
    return get_token(user_name)

