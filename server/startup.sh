#! /bin/bash

source ./venv/bin/activate
export DATABASE_URL='postgres://localhost/talktime'
export FLASK_APP='app.py'