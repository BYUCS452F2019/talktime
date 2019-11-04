from flask import request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Availabilities import Availabilities
from server.api import token_required

class Timezones(db.Model):
  id = db.Column(db.Integer, primary_key=True, nullable=False)
  name = db.Column(db.String(64), nullable=False)
  t_offset = db.Column(db.Integer, nullable=False)

  def __init__(self, id, name, offset):
    self.id = id
    self.name = name
    self.t_offset = offset

  def to_dict(self):
    return dict(id=self.id, timezone_name=self.name, timezone_offset=self.t_offset)
