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
    'user_id': fields.String,
    'day_of_week': fields.Integer,
    'from_time': fields.Integer,
    'to_time': fields.Integer
})


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

            keys = ['user_id', 'day_of_week', 'from_time', 'to_time']
            for key in keys:
            if key not in data:
                return {'message': 'Request missing field: {}'.format(key), 'success': False}

            for key in data.keys():
            if key not in keys:
                return {'message': 'Invalid key: {}'.format(key), 'success': False}

            user_id = data['user_id']
            day_of_week = data['day_of_week']
            from_time = data['from_time']
            to_time = data['to_time']
            # logic to convert from and to times to a universal time.
            # ----------------------------------------------------------
            timezone = curr_user.pref_timezone
            offset = 0000 # get offset from reference by timezone
            from_time += offset
            to_time += offset
            # logic for shifting to left (ie negative offset)
            if from_time < 0000: # offset caused date to go backwards
                from_time = 1440 + from_time
                day_of_week = day_of_week - 1 # go to day before
                if to_time < 0000:
                    to_time = 1440 + to_time
                else: # chunk of time is split between days now.
                    day_of_week2 = day_of_week + 1 # index back to original day of week
                    from_time2 = 0000
                    to_time2 = to_time
                    to_time = 1440
                    availability = Availabilities(user_id, day_of_week2, from_time2, to_time2)
            # logic for shifting to the right (positive offset)
            if to_time > 1440: # offset pushes end time into next day
                to_time = to_time - 1440
            # ----------------------------------------------------------
            availability = Availabilities(user_id, day_of_week, from_time, to_time)
            db.session.add(availability)
            db.session.commit()
            return {'message': 'Availability added successfully', 'success': True}
        except Exception as e:
            return {'message': "Post error, Traceback: ".format(e), 'success': False}
