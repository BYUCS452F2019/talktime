from server.app import db


class Languages(db.Model):
  __tablename__ = 'languages'
  id = db.Column(db.Integer, primary_key=True)
  language_name = db.Column(db.String, nullable=False)

  def __repr__(self):
    return '<Languages -> id: {}, language_name: {}'.format(
        self.id, self.language_name
    )

  def to_dict(self):
    return dict(id=self.id, language_name=self.language_name)
