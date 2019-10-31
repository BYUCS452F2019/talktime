from server.app import db


class LanguagesWanted(db.Model):
  __tablename__ = 'languages_wanted'
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey(
      'users.id'
  ), nullable=False)
  language_id = db.Column(db.Integer, db.ForeignKey(
      'languages.id'
  ), nullable=False)

  # Relationships
  user = db.relationship('Users', backref='languages_wanted')
  language = db.relationship('Languages', backref='languages_wanted')

  def __init__(self, user_id, language_id):
    self.user_id = user_id
    self.language_id = language_id

  def __repr__(self):
    return '<LanguagesWanted -> id: {}, user_id: {}, language_id: {}'.format(
        self.id, self.user_id, self.language_id
    )

  def to_dict(self):
    return dict(id=self.id, user_id=self.user_id, language_id=self.language_id)
