from server.app import db


class LanguagesKnown(db.Model):
  __tablename__ = 'languages_known'
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey(
      'users'
  ), nullable=False)
  language_id = db.Column(db.Integer, db.ForeignKey(
      'languages'
  ), nullable=False)

  # Relationships
  user = db.relationship('users', backref='languages_known')
  language = db.relationship('languages', backref='languages_known')

  def __repr__(self):
    return '<LanguagesKnown -> id: {}, user_id: {}, language_id: {}'.format(
        self.id, self.user_id, self.language_id
    )

  def to_dict(self):
    return dict(id=self.id, user_id=self.user_id, language_id=self.language_id)
