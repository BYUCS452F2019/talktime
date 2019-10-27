# How to make a new Talktime API endpoint

So you want to make a new endpoint, huh? Well, you've come to the right place! There's a lot that goes into it, but this little guide should give you everything you need to get a new endpoint up and running in no time.

## 1. Make a file in server/api with the name of the endpoint

Let's follow the convention of making all of our endpoints have the same name as the Python file containing the logic for that endpoint. Inside of the server/api folder, you'll see files like `login.py` and `update_user.py`. All of our routes are under the namespace "/api", so those files would correspond to the '/api/login' and '/api/update_user' endpoints, respectively.

When you want to make a new endpoint, all you have to do is create a new Python file inside of the api folder. For example, if you want to make '/api/accept_request' endpoint allowing users to accept chat requests, just make a `accept_request.py` file inside that folder.

## 2. Import required libraries

You'll want the following imports in just about any endpoint you're going to make:

```python
from flask import request
from flask_restplus import Resource, fields
from server.app import api, db
from server.models.Requests import Requests
from server.api import get_token, token_required, verify_request
```

You'll also need to import the model classes that you'll be querying. For example, for our '/api/accept_request' endpoint, we'd probably have to import the Requests model. So, under the imports listed above, we would add this:

```python
from server.models.Requests import Requests
```

Your imports are now good to go!

## 3. Create your namespace, expected data model, and response model

You'll first create a namespace, which is just going to be the name of the route. So, for our example api/accept_request endpoint, we'll just make a namespace like so (assuming you've imported everthing mentioned in step 2!):

```python
NS = api.namespace('accept_request', description='Accept a chat request')
```

Make sure to provide a `description` kwarg so that other developers can see what your route does in the Swagger UI.

It's important to document our endpoints with the expected form data that the client should POST or PATCH as well as how the server is going to respond. It makes the frontend developers' lives about a million times easier!

For api/accept_request, the form will probably just need to contain the ID of the request to accept, which is going to be an integer. Let's make a model detailing this:

```python
request_form = api.model('Accept request model', {
  'request_id': fields.Integer
})
```

Let's also make a model detailing the kind of response that the server will give on completion. We could just return an object with a success message:

```python
accept_response = api.model('Accept request response', {
  'message': fields.String
})
```

Now let's make a class that uses these models.

## 4. Create a class detailing actions for each response method
