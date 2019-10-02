# Setting up the server locally

If you do not have a virtual environment, you will need to set one up. This makes sure that all of our installed dependencies stay the same across everyone's machine.

To set up a virtual machine:

1. `python -m venv venv`
2. `source venv/bin/activate`

You will now be in the virtual environment. Now run:

`pip install -r requirements.txt`

You will now have all the dependencies installed in your virtual environment. The last thing you need to do is set up your Flask environment by running:

`export FLASK_APP=app.py`

You might consider putting the above export statement in your `.bashrc` file so that you don't have to do it everytime you want to run the server.

To run the app, just do:

`flask run`

Go to http://localhost:5000 and you will see the app running!
