'''
GET language id mapped to language name
'''

from flask import request
from flask_restplus import Resource, fields
from server.api import token_required
from server.models.Timezones import Timezones
from server.app import api

timezone = api.model('Timezone', {
  'id': fields.Integer,
  'timezone_name': fields.String,
  'timezone_offset': fields.Integer
})

NS = api.namespace('get_timezones', 
  description="Get a list of available timezones in Talktime.")

@NS.route('')
class GetTimezones(Resource):
  @NS.marshal_list_with(timezone)
  def get(self):
    return [t.to_dict() for t in Timezones.query.all()]
    
