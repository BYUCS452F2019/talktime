from flask import Flask, Blueprint
from .config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restplus import Api
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

@app.route('/')
def index():
  return 'Welcome to talktime!'

db = SQLAlchemy(app)
migrate = Migrate(app, db)


# Set up Open API
api = Api(app, version='1.0', title='Talktime REST API',
  description='API endpoints for the Talktime app.', doc='/docs')
blueprint = Blueprint("api", __name__, url_prefix="/api")
api.init_app(blueprint)
app.register_blueprint(blueprint)

CORS(app)

from server import routes
from .models.Languages import Languages

languages = ['English', 'Spanish', 'Mandarin', 'Klingon']
for l in languages:
  language = Languages(l)
  if Languages.query.filter_by(language_name=l).count() < 1:
    db.session.add(language)
db.session.commit()