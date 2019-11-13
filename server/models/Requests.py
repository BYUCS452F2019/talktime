from server.app import db
from server.models.Users import Users


class Requests(db.Model):
  __tablename__ = 'requests'
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  other_user_id = db.Column(
      db.Integer, db.ForeignKey('users.id'), nullable=False)
  from_time = db.Column(db.DateTime, nullable=False)
  to_time = db.Column(db.DateTime, nullable=False)
  
  req_accepted = db.Column(db.Boolean, nullable=False)
  req_confirmed = db.Column(db.Boolean, nullable=False)

  def __init__(self, user_id, other_user_id, from_time, to_time, req_accepted=False, req_confirmed=False):
    self.user_id = user_id
    self.other_user_id = other_user_id
    self.from_time = from_time
    self.to_time = to_time
    self.req_accepted = req_accepted
    self.req_confirmed = req_confirmed

  # Relationships
  # TODO figure out have relationships with two User objects

  def __repr__(self):
    return '<Requests -> id: {}, user_id: {}, other_user_id: {}, from_time: {}, to_time: {}, req_accepted: {}, req_confimed: {}'.format(
        self.id, self.user_id, self.other_user_id, self.from_time,
        self.to_time, self.req_accepted, self.req_confirmed
    )

  def to_dict(self):
    user = Users.query.get(self.user_id)
    return dict(id=self.id, user_id=self.user_id, other_user_id=self.other_user_id,
                from_time=self.from_time, to_time=self.to_time, req_accepted=self.req_accepted,
                req_confirmed=self.req_confirmed, name=user.user_name)
