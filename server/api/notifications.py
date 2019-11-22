from server.app import mdb
from flask import request
from flask_restplus import Resource, fields
from server.api import token_required, verify_request
from server.app import api, db
from server.models.Requests import Requests
from server.models.Users import Users
from pprint import pprint
from bson import ObjectId

NS = api.namespace('notifications',
                   description='View notifications')

READ_PATCH_FORM = {
    'id': fields.String  # ID of notification to mark as read
}

READ_PATCH_MODEL = api.model('Read notification model', READ_PATCH_FORM)


def mongo_encode(doc):
  enc_doc = {}
  for key in doc:
    if isinstance(doc[key], ObjectId):
      enc_doc[key] = str(doc[key])
    else:
      enc_doc[key] = doc[key]
  return enc_doc


@NS.route('')
class Notifications(Resource):
  @token_required
  def get(self, user):
    notifications = mdb.notifications
    nots = []
    for notification in notifications.find({'user_id': user.id}):
      nots.append(mongo_encode(notification))
    return nots

  @NS.expect(READ_PATCH_MODEL)
  @token_required
  def patch(self, user):
    data = request.get_json()
    if not data:
      data = request.form

    verify_request(['id'], data)
    notifications = mdb.notifications
    query = {'_id': ObjectId(data['id'])}
    new_values = {'$set': {'read': True}}

    update_notification = notifications.find_one(query)

    if not update_notification:
      api.abort(400, 'Notification with that id does not exist')
    if update_notification['user_id'] != user.id:
      api.abort(400, 'You are not authorized to update this notification')

    notifications.update_one(query, new_values)
    return "Success"
