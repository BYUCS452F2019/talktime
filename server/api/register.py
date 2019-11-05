from flask import request
from server.api import get_token, verify_request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Users import Users
from server.models.LanguagesKnown import LanguagesKnown
from server.models.LanguagesWanted import LanguagesWanted
from server.models.Languages import Languages

NS = api.namespace('register',
                   description='Endpoint for registering a new user.')

token = api.model('Token', {
    'token': fields.String,
    'user_id': fields.String,
    'user_name': fields.String,
    'email': fields.String,
    'pref_timezone': fields.String,
    'message': fields.String,
    'authenticated': fields.Boolean
})

form_input = api.model('Register form', {
    'user_name': fields.String,
    'email': fields.String,
    'password': fields.String,
    'pref_timezone': fields.String,
    'native_language': fields.Integer,
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

    keys = ['user_name', 'email', 'password',
            'pref_timezone', 'native_language', 'pref_language']

    verify_request(keys, data)

    user_name = data['user_name']
    email = data['email']
    password = data['password']
    pref_timezone = data['pref_timezone']
    native_language_id = data['native_language']
    pref_language_id = data['pref_language']

    last_id = Users.query.all()[-1].id + 1
    user = Users(id=last_id, user_name=user_name, email=email, password=password, pref_timezone=pref_timezone)

    native_language = Languages.query.get(native_language_id)
    pref_language = Languages.query.get(pref_language_id)

    if not native_language or not pref_language:
      api.abort(401, 'Language ID not found')

    l_known = LanguagesKnown(user_id=user.id, language_id=native_language.id)
    l_wanted = LanguagesWanted(user_id=user.id, language_id=pref_language.id)

    db.session.add(user)
    db.session.add(l_known)
    db.session.add(l_wanted)
    db.session.commit()
    
    token = get_token(user_name)
    token['user_id'] = user.id
    token['user_name'] = user_name
    token['email'] = email
    token['pref_timezone'] = pref_timezone
    return token
