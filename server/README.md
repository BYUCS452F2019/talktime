# Project Schema

* users (user_id, user_name, password_hash, pref_timezone)
* languages_wanted (user_id, language_id)
  *	Foreign Key user_id references users
  * Foreign Key language_id references languages

* languages (language_id, language_name)

* availablity (user_id, day_of_week, from_time, to_time)
  * Foreign Key user_id references users

*	requests (request_id, user_id, other_user_id, from_time, to_time, req_accepted, req_confirmed)
  * Foreign Key user_id references users
  * Foreign Key other_user_id references users

* languages_known (user_id, language_id)
  * Foreign Key user_id references users
  * Foreign Key language_id references languages
