from flask import request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Requests import Requests
from server.api import get_token, token_required, verify_request
from server.models.Requests import Requests
from server.models.Users import Users
from server.api.get_user import USER_MODEL
from server.helpers.user import get_user
from server.app import mdb

NS = api.namespace(
    'request', description="Make a request to chat with someone")

request_form = api.model('Request form', {
    'partner_id': fields.Integer,
    'from_time': fields.Integer,
    'to_time': fields.Integer
})

success_resp = api.model('Successful request', {
    'message': fields.String
})


GET_REQUEST_RESPONSE = api.model('Get request response', {
    'request_id': fields.Integer,
    'other_user': fields.Nested(USER_MODEL),
    'from_time': fields.String,
    'to_time': fields.String,
    'req_accepted': fields.Boolean,
    'req_confirmed': fields.Boolean
})


@NS.route('')
class Request(Resource):
  # @NS.marshal_list_with(GET_REQUEST_RESPONSE)
  @token_required
  def get(self, user):
    requests = Requests.query.filter_by(user_id=user.id)

    resp = []
    for req in requests:
      req_object = {
          'request_id': req.id,
          'other_user': get_user(req.other_user_id),
          'from_time': str(req.from_time),
          'to_time': str(req.to_time),
          'req_accepted': req.req_accepted,
          'req_confirmed': req.req_confirmed
      }
      resp.append(req_object)
    return resp

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

      partner = Users.query.get(partner_id)
      mdb.notifications.insert_one({
        'message': f'{partner.user_name} wants to chat with you!',
        'read': False,
        'user_id': user.id
      })
      return {'message': 'Success'}
    except Exception as e:
      api.abort(500, 'Failed to create chat request')
