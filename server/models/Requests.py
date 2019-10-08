from server.app import db


class Requests(db.Model):
  __tablename__ = 'requests'
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  other_user_id = db.Column(
      db.Integer, db.ForeignKey('users.id'), nullable=False)
  from_time = db.Column(db.Integer, nullable=False)
  to_time = db.Column(db.Integer, nullable=False)
  req_accepted = db.Column(db.Boolean, nullable=False)
  req_confirmed = db.Column(db.Boolean, nullable=False)

  # Relationships
  # TODO figure out have relationships with two User objects

  def __repr__(self):
    return '<Requests -> id: {}, user_id: {}, other_user_id: {}, from_time: {}, to_time: {}, req_accepted: {}, req_confimed: {}'.format(
        self.id, self.user_id, self.other_user_id, self.from_time,
        self.to_time, self.req_accepted, self.req_confirmed
    )

  def to_dict(self):
    return dict(id=self.id, user_id=self.user_id, other_user_id=self.other_user_id,
                from_time=self.from_time, to_time=self.to_time, req_accepted=self.req_accepted,
                req_confirmed=self.req_confirmed)
