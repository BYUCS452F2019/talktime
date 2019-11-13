from server.app import mdb
from flask import request
from flask_restplus import Resource, fields
from server.api import token_required
from server.app import api, db
from server.models.Requests import Requests
from server.models.Users import Users
from pprint import pprint
from bson import ObjectId

NS = api.namespace('notifications',
                   description='View notifications')

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
