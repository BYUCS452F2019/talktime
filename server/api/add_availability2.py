from flask import request
from server.api import token_required
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Availabilities import Availabilities
from server.models.Users import Users

NS = api.namespace('add_availability',
                   description='Endpoint for adding a new availability.')

success = api.model('Success', {
    'message': fields.String,
    'success': fields.Boolean
})

form = api.model('availability form', {
    'from_time': fields.DateTime,
    'to_time': fields.DateTime
})

timezone_dict = {"BakerIsland":-720, "HowlandIsland":-720 }
@NS.route('')
class Register(Resource):
    @api.expect(form_input)
    @api.marshal_with(token)
    @token_required
    def post(self, curr_user):
        try:
            data = request.get_json()
            if data == None:
            data = request.form

            keys = ['from_time', 'to_time']
            for key in keys:
            if key not in data:
                return {'message': 'Request missing field: {}'.format(key), 'success': False}

            for key in data.keys():
            if key not in keys:
                return {'message': 'Invalid key: {}'.format(key), 'success': False}

            from_time = data['from_time']
            to_time = data['to_time']
            from_time.tzinfo = pytz.timezone(curr_user.pref_timezone)
            to_time.tzinfo = pytz.timezone(curr_user.pref_timezone)
            availability = Availabilities(curr_user.id, from_time, to_time)
            db.session.add(availability)
            db.session.commit()
            return {'message': 'Availability added successfully', 'success': True}
        except Exception as e:
            return {'message': "Post error, Traceback: ".format(e), 'success': False}
