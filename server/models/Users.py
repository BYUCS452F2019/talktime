from server.app import db


class Users(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True)
  user_name = db.Column(db.String, nullable=False)
  email = db.Column(db.String, nullable=False)
  password_hash = db.Column(db.String, nullable=False)
  pref_timezone = db.Column(db.String, nullable=False)

  def __repr__(self):
    return '<Users -> id: {}, user_name: {}, email: {}, password_hash: {}, pref_timezone: {}'.format(
        self.id, self.user_name, self.email, self.password_hash, self.pref_timezone
    )

  def to_dict(self):
    return dict(id=self.id, user_name=self.user_name, email=self.email,
                password_hash=self.password_hash, pref_timezone=self.pref_timezone)
