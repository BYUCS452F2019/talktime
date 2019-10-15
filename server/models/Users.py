from server.app import db
from werkzeug.security import generate_password_hash, check_password_hash


class Users(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True)
  user_name = db.Column(db.String, nullable=False)
  email = db.Column(db.String, nullable=False)
  password_hash = db.Column(db.String, nullable=False)
  pref_timezone = db.Column(db.String, nullable=True)

  def __init__(self, user_name, email, password):
    self.user_name = user_name
    self.email = email
    self.password_hash = generate_password_hash(password, method='sha256')

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
                password_hash=self.password_hash, pref_timezone=self.pref_timezone)
