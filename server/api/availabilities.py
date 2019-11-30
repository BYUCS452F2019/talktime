from flask import request
from server.api import token_required
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Availabilities import Availabilities
from server.models.Timezones import Timezones
from server.models.Users import Users

NS = api.namespace('availabilities',
                   description='Endpoint for adding a new availability.')

success = api.model('Success', {
    'message': fields.String,
    'success': fields.Boolean
})

availability = api.model('Availability', {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'day_of_week': fields.Integer,
    'from_time': fields.Integer,
    'to_time': fields.Integer
})

all_availabilities = api.model('availabilities', {
    'availabilities': fields.List(fields.Nested(availability))
})

form = api.model('availability form', {
    'user_id': fields.Integer,
    'day_of_week': fields.Integer,
    'from_time': fields.Integer,
    'to_time': fields.Integer
})

@NS.route('')
class AddAvailability(Resource):
    @api.expect(form)
    @api.marshal_with(success)
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
            timezone = curr_user.pref_timezone


            #Tz = Timezones.query.filter_by(id=timezone).first()
            offset = 0#Tz.t_offset
            from_time -= offset
            to_time -= offset
            # logic for shifting to left (ie negative offset)
            if from_time < 0000: # offset caused date to go backwards
                from_time = 1440 + from_time
                day_of_week = day_of_week - 1 # go to day before
                if day_of_week < 0:
                    day_of_week = 6
                if to_time <= 0000:
                    to_time = 1440 + to_time
                else: # chunk of time is split between days now.
                    day_of_week2 = day_of_week + 1 # index back to original day of week
                    if day_of_week > 6:
                        day_of_week = 0
                    from_time2 = 0000
                    to_time2 = to_time
                    to_time = 1440
                    availability = Availabilities(user_id, day_of_week2, from_time2, to_time2)
            # logic for shifting to the right (positive offset)
            elif to_time > 1440: # offset pushes end time into next day
                to_time = to_time - 1440
                day_of_week += 1
                if day_of_week > 6:
                    day_of_week = 0
                if from_time >= 1440:
                    from_time = from_time - 1440
                else: # chunk of time is split between two days
                    day_of_week2 = day_of_week - 1
                    if day_of_week < 0:
                        day_of_week = 6
                    from_time2 = from_time
                    to_time2 = 1440
                    from_time = 0000
                    #print(day_of_week2)
                    #print(from_time2)
                    #print(to_time2)
                    availability = Availabilities(user_id, day_of_week2, from_time2, to_time2)
            # ----------------------------------------------------------
            print("Committing!")
            availability = Availabilities(user_id, day_of_week, from_time, to_time)
            db.session.add(availability)
            db.session.commit()
            return {'message': 'Availability added successfully', 'success': True}
        except Exception as e:
            print("error", e)
            return {'message': "Post error, Traceback: ".format(e), 'success': False}
            
    @api.marshal_with(all_availabilities)
    @token_required
    def get(self, curr_user):
        try:
            availabilities = Availabilities.query.filter_by(user_id=curr_user.id)
            valid_availabilities = []
            for availability in availabilities:
                from_time = availability.from_time
                to_time = availability.to_time
                day_of_week = availability.day_of_week

                # shift from_time and to_time based on user pref_timezone
                timezone = curr_user.pref_timezone
                #Tz = Timezones.query.filter_by(id=timezone).first()
                offset = 0#Tz.t_offset
                from_time += offset
                to_time += offset
                # logic for shifting to left (ie negative offset)
                if from_time < 0000: # offset caused date to go backwards
                    from_time = 1440 + from_time
                    day_of_week = day_of_week - 1 # go to day before
                    if to_time < 0000:
                        to_time = 1440 + to_time
                # logic for shifting to the right (positive offset)
                elif to_time > 1440: # offset pushes end time into next day
                    to_time = to_time - 1440
                    day_of_week += 1
                    if from_time > 1440:
                        from_time = from_time - 1440
                valid_availabilities.append({'id':availability.id, 'user_id':availability.user_id, 'day_of_week':day_of_week, 'from_time':from_time, 'to_time':to_time})
            return {'availabilities': valid_availabilities}
        except Exception as e:
            print(e)
            return None


