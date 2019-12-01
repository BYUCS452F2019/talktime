from flask import request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Requests import Requests
from server.api import get_token, token_required
from server.app import mdb
from bson import ObjectId

request_form = api.model('Accept request model', {
  'request_id': fields.String
})

accept_response = api.model('Accept request response', {
  'message': fields.String
})

NS = api.namespace('accept_request', description='Accept a chat request')

@NS.route('')
class AcceptRequest(Resource):
  #What you post
  @NS.expect(request_form)
  #What you return
  @NS.marshal_with(accept_response)
  #Checking if the user is registered
  @token_required
  def post(self, cur_user):
    # If cur_user is not authenticated, decorator return to the client without entering this function
    accept_request = request.get_json()
    if accept_request == None:
      accept_request = request.form

    # Query the Request table for info about this chat request
    # request_id = accept_request['request_id']
    # chat_request = Requests.query.get(request_id)

    # if (chat_request == None):
    #     api.abort(401, 'Invalid request ID')

    # # Verify that the current user is requested with this chat request
    # if (chat_request.other_user_id != cur_user.user_id):
    #     api.abort(401, 'This chat invitation does not belong to the current user')

    # Requests Verified, Try to accept the request by changing the req_accepted column to True
    try:
        query = {"_id": ObjectId(accept_request['request_id'])}
        new_vals = {"req_accepted": True}
        mdb.requests.update_one(query, new_vals)
        # chat_request.req_accepted = True
        # db.session.commit()
        return {'message': 'Success'}
    except Exception as e:
        api.abort(500, 'Failed to accept chat request')

