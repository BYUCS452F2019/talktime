'''
PATCH route to update email, password, username, etc.
Return success message
'''
from flask import request
from flask_restplus import Resource, fields
from server.api import token_required
from server.app import api, db
from server.models.Users import Users

#input form
update_form = api.model('Update form', {
    'user_name': fields.String,
    'email': fields.String,
    'pref_timezone': fields.String
})

#output form
status = api.model('Status', {
    'message': fields.String,
})

NS = api.namespace('update_user', description='Update a user\'s information')

@NS.route('')
class UpdateUser(Resource):
  #What you post
  @NS.expect(update_form)
  #What you return
  @NS.marshal_with(status)
  #Checking if the user is registered
  @token_required
  def patch(self, cur_user):
    # If cur_user if not authenticated, decorator return to the client without entering this function
    user_request = request.get_json()  # ImmutableMultiDict
    if user_request == None:
      user_request = request.form

    # Checking the fields
    keys = ['user_name', 'email', 'pref_timezone']
    for key in keys:
      if key not in user_request:
        return {'message': 'Request missing field: {}'.format(key), 'authenticated': False}

    user_info = {
      "id": cur_user.id,
      "user_name": cur_user.user_name,
      "email": cur_user.email,
      "pref_timezone": cur_user.pref_timezone
    }

    # Extracting parameters to update
    user_patch = {}
    for key in user_request.keys():
      if (user_request.get(key) == ''):
        continue
      if (user_info.get(key) == user_request.get(key)):
        continue
      user_patch[key] = user_request.get(key)

    # Nothing to update
    if (len(user_patch) == 0):
      return {'message': 'No changes Needed'}

    # Check duplicates using filter_by
    if Users.query.filter_by(user_name=user_patch['user_name']).count() > 0:
      return {'message': 'Username is taken'}

    # Updating the user object
    for key in user_patch.keys():
      # Re-setting the data member
      setattr(cur_user, key, user_patch.get(key))
    # Updating the database
    db.session.commit()

    return {'message': 'success'}
