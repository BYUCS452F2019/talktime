from server.app import db


class LanguagesKnown(db.Model):
  __tablename__ = 'languages_known'
  id = db.Column(db.Integer, primary_key=True, nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey(
      'users.id'
  ), nullable=False)
  language_id = db.Column(db.Integer, db.ForeignKey(
      'languages.id'
  ), nullable=False)

  # Relationships
  user = db.relationship('Users', backref='languages_known')
  language = db.relationship('Languages', backref='languages_known')

  def __init__(self, **kwargs):
    self.id = kwargs.get('id')
    self.user_id = kwargs.get('user_id')
    self.language_id = kwargs.get('language_id')

  def __repr__(self):
    return '<LanguagesKnown -> id: {}, user_id: {}, language_id: {}'.format(
        self.id, self.user_id, self.language_id
    )

  def to_dict(self):
    return dict(id=self.id, user_id=self.user_id, language_id=self.language_id)
