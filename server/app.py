from flask import Flask, Blueprint
from server.config import Config
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
from .models.Timezones import Timezones

languages = ['English', 'Spanish', 'Mandarin', 'Klingon']
for l in languages:
  language = Languages(l)
  if Languages.query.filter_by(language_name=l).count() < 1:
    db.session.add(language)

timezone_dict = {"BakerIsland":-720, "Samoa":-660, "French Polynesia":-600, "Anchorage":-540, "Los Angeles":-480, "Denver":-420, "Dallis":-360, "New York":-300, "Virgin Islands":-240, "Rio":-180, "South Sandwish Islands":-120, "Cabo Verde":-60, "UTC":0, 
                 "Paris":60, "Cape Town":120, "Moscow":180, "Dubai":240, "Maldives":300, "Omsk":360, "Bangkok":420, "Shanghai":480, "Tokyo":540, "Sydney":600, "Solomon Islands":660, "Auckland":720}

id = 1
for key, value in timezone_dict.items():
  timezone = Timezones(id, key, value)
  if Timezones.query.filter_by(name=key).count() < 1:
    db.session.add(timezone)
    id += 1
    
db.session.commit()