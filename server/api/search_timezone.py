''' POST user id << do we need this? we have the user via @token_required
Match with other users
who have the same timezone
and language.

Return a list of users, and count
'''
from flask import request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Users import Users
from server.api import token_required

NS = api.namespace(
    "search_timezone", description="Query for users with same preferred timezone")

username = api.model('username', {
    'username': fields.String
})

response = api.model('Users', {
    'usernames': fields.List(fields.Nested(username))
})

# form = api.model('user', {
#     'user_id': fields.String
# })


@NS.route("")
class SearchTimezone(Resource):
  '''Contains post method for logging in'''

  @api.marshal_with(response)
  @token_required
  def get(self, curr_user):

    users = Users.query.filter_by(pref_timezone=curr_user.pref_timezone).all()
    u_list = []
    for user in users:
      u_list.append({'username': user.user_name})

    res = {'usernames': u_list}

    return res
