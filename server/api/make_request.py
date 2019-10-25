from flask import request
from flask_restplus import Resource, fields
from server.app import api
from server.models.Requests import Requests
from server.api import get_token

NS = api.namespace(
    'make_request', description="Make a request to chat with someone")

form = api.model('Request form', {
    'partner_id', fields.Integer,
    'from_time': fields.Integer,
    'to_time': fields.Integer
})
