''' GET
Match with other users
who have the same timezone
and language.

Return a list of users, and count
'''
from flask import request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Users import Users, Availabilities
from server.api import token_required

NS = api.namespace(
    "search_timezone", description="Query for users with same preferred timezone")

request = api.model('', {
    'day_of_week': fields.Integer,
    'from_time': fields.Integer,
    'to_time': fields.Integer
})

availabilities = api.model('availability', {
    'id': fields.String,
    'userid': fields.String,
    'day_of_week': fields.Integer,
    'from_time': fields.Integer,
    'to_time': fields.Integer
})

response = api.model('availabilities', {
    'availabilities': fields.List(fields.Nested(availabilities))
})


@NS.route("")
class SearchTimezone(Resource):
  '''Contains post method for logging in'''
    @api.marshal_with(response)
    @api.expect(request)
    @token_required
    def get(self, curr_user):
        data = request.get_json()
        if data == None:
            data = request.form

        keys = ['day_of_week', 'from_time', 'to_time']
        for key in keys:
            if key not in data:
                return {'availabilities': None}

        for key in data.keys():
            if key not in keys:
                return {'availabilities': None}

        req_day_of_week = data['day_of_week']
        req_from_time = data['from_time']
        req_to_time = data['to_time']
        availabilities = Availabilities.query.all()

        valid_availabilities = []
        for availability in availabilities:
            from_time = availability.from_time
            to_time = availability.to_time
            day_of_week = availability.day_of_week

            # shift from_time and to_time based on user pref_timezone
            timezone = curr_user.pref_timezone
            offest = 0000
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
            # logic for shifting to the right (positive offset)
            elif to_time > 1440: # offset pushes end time into next day
                to_time = to_time - 1440
                day_of_week += 1
                if from_time > 1440:
                    from_time = from_time - 1440
                else: # chunk of time is split between two days
                    day_of_week2 = day_of_week - 1
                    from_time2 = from_time
                    to_time2 = 1440
                    from_time = 0000
            if day_of_week == req_day_of_week:
                if (from_time <= req_from_time and to_time >= req_from_time) or 
                   (from_time >= req_from_time and to_time <= req_to_time) or 
                   (from_time <= req_to_time and to_time >= req_to_time):
                    valid_availabilities.append({'id': availability.id, 'user_id': availability.user_id,'day_of_week': day_of_week, 'from_time':from_time, 'to_time':to_time})
            elif day_of_week2 == req_day_of_week:
                if (from_time2 <= req_from_time and to_time2 >= req_from_time) or 
                   (from_time2 >= req_from_time and to_time2 <= req_to_time) or 
                   (from_time2 <= req_to_time and to_time2 >= req_to_time):
                    valid_availabilities.append({'id': availability.id, 'user_id': availability.user_id,'day_of_week': day_of_week2, 'from_time':from_time2, 'to_time':to_time2})

        res = {'availabilities': valid_availabilities}

        return res
