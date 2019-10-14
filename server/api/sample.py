from flask_restplus import Resource
from server.app import api, db

NS = api.namespace('sample',
  description="Sample route")
  
@NS.route('/')
class Sample(Resource):
  def get(self):
    a = {'a': 1, 'b': 2}
    return a
  def post(self):
    print('hi')