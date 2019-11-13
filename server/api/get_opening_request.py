'''
Get route to get all of the opening requests for the user
Return success message
'''
from flask import request
from flask_restplus import Resource, fields
from server.api import token_required
from server.app import api, db
from server.models.Requests import Requests

#output form
opening_request = api.model('Opening Request', {
    'user_name': fields.String,
    'from_time': fields.Integer,
    'to_time': fields.Integer,
    'req_accepted': fields.Boolean,
    'req_confirmed': fields.Boolean
})

NS = api.namespace('get_opening_request', description='Get all opening requests of a user')

@NS.route('')
class GetOpeningRequest(Resource):
  @NS.marshal_list_with(opening_request)
  @token_required
  def get(self, cur_user):
      # Search the request table and return all opening requests (confirmed = false, acceptd = false)
      return [ request.to_dict() for request in Requests.query.filter_by(
          other_user_id=cur_user.id, 
          req_accepted=False,
          req_confirmed=False).all() ]