from server.app import db


class Availabilities(db.Model):
  __tablename__ = 'availabilities'
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey(
      'users.id'
  ), nullable=False)
  day_of_week = db.Column(db.Integer, nullable=False)
  from_time = db.Column(db.Integer, nullable=False)
  to_time = db.Column(db.Integer, nullable=False)

  # Relationships
  user = db.relationship('Users', backref='availabilities')


  def __init__(self, user_id, day_of_week, from_time, to_time):
    self.user_id = user_id
    self.day_of_week = day_of_week
    self.from_time = from_time
    self.to_time = to_time

  def __repr__(self):
    return '<Availabilities -> id: {}, user_id: {}, day_of_week: {}, from_time: {}, to_time: {}'.format(
        self.id, self.user_id, self.day_of_week, self.from_time, self.to_time
    )

  def to_dict(self):
    return dict(id=self.id, user_id=self.user_id, day_of_week=self.day_of_week,
                from_time=self.from_time, to_time=self.to_time)
