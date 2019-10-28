from flask import request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Requests import Requests
from server.api import get_token, token_required, verify_request
from server.models.Requests import Requests
from server.models.Users import Users

NS = api.namespace(
    'make_request', description="Make a request to chat with someone")

request_form = api.model('Request form', {
    'partner_id': fields.Integer,
    'from_time': fields.Integer,
    'to_time': fields.Integer
})

success_resp = api.model('Successful request', {
    'message': fields.String
})


@NS.route('')
class MakeRequest(Resource):
  @NS.expect(request_form)
  @NS.marshal_with(success_resp)
  @token_required
  def post(self, user):
    data = request.get_json()
    if not data:
      data = request.form

    verify_request(['partner_id', 'from_time', 'to_time'], data)

    partner_id = int(data['partner_id'])
    from_time = data['from_time']
    to_time = data['to_time']

    # Make sure ids are distinct
    if partner_id == user.id:
      api.abort(401, 'You cannot make a request with yourself')
    
    
    # Make sure the user requested to chat with exists
    if not Users.query.get(partner_id):
      api.abort(401, 'You cannot make a request with a nonexistent user')

    try:
      chat_request = Requests(user.id, partner_id, from_time, to_time)
      db.session.add(chat_request)
      db.session.commit()
      return {'message': 'Success'}
    except Exception as e:
      api.abort(500, 'Failed to create chat request')
