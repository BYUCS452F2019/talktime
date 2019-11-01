'''
GET language id mapped to language name
'''

from flask import request
from flask_restplus import Resource, fields
from server.api import token_required
from server.models.Languages import Languages
from server.app import api

language = api.model('Language', {
  'id': fields.Integer,
  'language_name': fields.String
})

NS = api.namespace('get_languages', 
  description="Get a list of available languages to use on Talktime.")

@NS.route('')
class GetLanguages(Resource):
  @NS.marshal_list_with(language)
  def get(self):
    return [l.to_dict() for l in Languages.query.all()]
    
