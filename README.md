# talktime
Learn a language by talking with other people, anywhere, anytime.

# Motivation
The fastest way to become conversationally fluent in a foreign language is to speak it with natives.  Many current language   apps in the market can connect you to native speakers, but leave it to you to coordinate across time zones and busy schedules.  Register with Talktime and leave the scheduling to us, while you focus on practicing your language!

We're hiring!  Looking for team of 3-4 people with experience in: git, React, PostgreSQL, and NodeJS.

# Aspects
## Business

Our business logic will be the safe storage of user's time preferences, as well as fast searching and sorting of available times across different langauge speakers.  We plan to make recommendations to users on who they can speak with, based on their availability.  When users connect, we want to remember which users are in touch, and how it went.  Talktime will take care of the complexity of trying to fit schedules from different timezones together.

## Legal

Although we store account information, we keep personal data to a minimum.  We will base accounts off of email addresses and passwords, but will not ask users for birth dates, social security numbers, or other sensitive information.  In the future, we may incorporate a paid tier of our service, for which we will most likely rely on a third party such as Stripe to handle payment processing.

## Technical

### User Interface

We will be creating a simple, functional web application in React.  There will be a login page, dashboard, scheduling page, and if time allows, a simple WebRTC P2P audiovisual feature.

### Database Architectures

We will be using PostgreSQL as a relational database, and further on in the course we will switch to Redis as a NoSQL backend.  We plan to store at the minimum: information about user accounts, known languages, languages being learned, schedule, history, and preferences.
