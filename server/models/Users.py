from server.app import db
from werkzeug.security import generate_password_hash, check_password_hash


class Users(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True, nullable=False)
  user_name = db.Column(db.String, nullable=False)
  email = db.Column(db.String, nullable=False)
  password_hash = db.Column(db.String, nullable=False)
  pref_timezone = db.Column(db.String, nullable=True)

  def __init__(self, **kwargs):
    self.id = kwargs.get('id')
    self.user_name = kwargs.get('user_name')
    self.email = kwargs.get('email')
    self.password_hash = generate_password_hash(
        kwargs.get('password'), method='sha256')
    self.pref_timezone = kwargs.get('pref_timezone')

  @classmethod
  def authenticate(cls, **kwargs):
    user_name = kwargs.get('user_name')
    password = kwargs.get('password')

    if not user_name or not password:
      return None

    user = cls.query.filter_by(user_name=user_name).first()
    if not user or not check_password_hash(user.password_hash, password):
      return None

    return user

  def __repr__(self):
    return '<Users -> id: {}, user_name: {}, email: {}, password_hash: {}, pref_timezone: {}'.format(
        self.id, self.user_name, self.email, self.password_hash, self.pref_timezone
    )

  def to_dict(self):
    return dict(id=self.id, user_name=self.user_name, email=self.email,
                pref_timezone=self.pref_timezone)
