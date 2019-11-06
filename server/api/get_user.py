from flask import request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Users import Users
from server.api import token_required

NS = api.namespace('get_user', description='Get user info')

USER_MODEL = api.model('User model', {
    'id': fields.Integer,
    'user_name': fields.String,
    'email': fields.String,
    'pref_timezone': fields.String,
    'learning_id': fields.Integer,
    'learning_language': fields.String,
    'native_id': fields.Integer,
    'native_language': fields.String
})


@NS.route('')
class GetUser(Resource):
  @NS.marshal_with(USER_MODEL)
  @token_required
  def get(self, user):
    resp = {
        'id': user.id,
        'user_name': user.user_name,
        'email': user.email,
        'pref_timezone': user.pref_timezone
    }

    ls_known = user.languages_known
    ls_wanted = user.languages_wanted

    if len(ls_known) > 0:
      l_known = ls_known[0]
      resp['native_id'] = l_known.language.id
      resp['native_language'] = l_known.language.language_name

    if len(ls_wanted) > 0:
      l_wanted = ls_wanted[0]
      resp['learning_id'] = l_wanted.language.id
      resp['learning_language'] = l_wanted.language.language_name

    return resp
