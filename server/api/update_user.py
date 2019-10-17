'''
PATCH route to update email, password, username, etc.
Return success message
'''
from flask import request
from flask_restplus import Resource, fields
from server.api import token_required
from server.app import api

NS = api.namespace('update_user', description='Update a user\'s information')

@NS.route('')
class UpdateUser(Resource):
  @token_required
  def post(self, cur_user):
    return cur_user.to_dict()
