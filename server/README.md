# Project Schema

* users (user_id, user_name, password_hash, pref_timezone)

This table represents the human user that is registered with the service.  It is referenced by tables including languages_wanted, availability, requests, languages_known.

* languages_wanted (user_id, language_id)
  *	Foreign Key user_id references users
  * Foreign Key language_id references languages
  
This table represents the relationship between a user and the languages that they want to learn.  It references both the languages and users tables.

* languages (language_id, language_name)

This table represents the different languages spoken around the world.  It is referenced by: languages_wanted and languages_known.

* availablity (user_id, day_of_week, from_time, to_time)
  * Foreign Key user_id references users
  
This table represents a user's availability to chat with someone else.  It references a user using their user_id.

*	requests (request_id, user_id, other_user_id, from_time, to_time, req_accepted, req_confirmed)
    * Foreign Key user_id references users
    * Foreign Key other_user_id references users
    
This table represents a request from one user to another user about chatting.  It references both users and availability tables.

* languages_known (user_id, language_id)
  * Foreign Key user_id references users
  * Foreign Key language_id references languages

This table represents the relationship between a user and the language(s) that they know.  It references both the languages and users tables.

Evidence of normalization: We included languages and users to abstract human users and possible languages in order to avoid confusion, make use of foreign keys, and reduce redundancy and dependency.  By building these constraints into our system, we are pre-emptively catching bugs concerning our data relationships.
