# Setting up the server locally

Note that these instructions are specifically for setting up the server for Unix based operating systems. If you are using Windows, I would recommend using the Linux subsystem for Windows 10 or installing a Linux virtual machine to make your life easier.

## Setting up the app for the first time (one-time steps)

### Creating the virtual environment

If you do not have a virtual environment, you will need to set one up. This makes sure that all of our installed dependencies stay the same across everyone's machine.

If you're setting this up for the first time, run the following command:

`python -m venv venv`

This will create a folder called `venv` that contains your virtual environment.

### Installing dependencies

While inside your virtual environment, run the following command to install all dependencies required for this project:

`pip install -r requirements.txt`

You will now have all the dependencies installed in your virtual environment. You should also run this command if you pull down changes that require a new dependency.

### Setting up PostgreSQL locally

Go to https://www.postgresql.org/download/ and download PostgreSQL for your operating system.

Now you will need to start the PostgreSQL service on your machine. First run the following:

`sudo -iu postgres`

Type in your sudo password and then run the following command to start the service:

`systemctl start postgresql`

Your PostgreSQL service should now be running!

To enter the PostgreSQL shell, just run:

`psql`

To create the talktime database, run

`create database talktime;`

Check out http://www.postgresqltutorial.com/psql-commands/ for some practical commands you can use in the PostgreSQL shell.

You will also need to export an environment variable called `DATABASE_URL` so that Flask can connect to the database. Run the following command:

`export DATABASE_URL="postgresql://localhost/talktime`

## Steps you should do every time you are developing

### Entering the virtual environment

Run the following command to enter the virtual environment (you will also need to run this command anytime you start developing):

`source venv/bin/activate`

You will now be in the virtual environment.

### Exporting yoru dependencies

If you need to install a Python package, first make sure you are in the virtual environment and then just use

`pip install <package-name>`

You will also need run the following command so that when other developers run `pip install -r requirements.txt`, they also have the new dependency:

`pip freeze > requirements.txt`

Now when other developers pull your changes, they will be able to install the correct version of the new dependency.

### Running the Flask app

Flask relies on an environment variable called `FLASK_APP` to know how to run the app. Since our app is found in the `app.py` file, run the following command to point flask to this file:

`export FLASK_APP=app.py`

You might consider putting the above export statement in your `.bashrc` file so that you don't have to do it everytime you want to run the server.

To run the app, just do:

`flask run`

Go to http://localhost:5000 and you will see the app running!
