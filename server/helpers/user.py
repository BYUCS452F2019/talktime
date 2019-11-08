def get_user(user_id):
  resp = {
      'id': user.id,
      'user_name': user.user_name,
      'email': user.email,
      'pref_timezone': user.pref_timezone
  }

  ls_known = user.languages_known
  ls_wanted = user.languages_wanted

  if len(ls_known) > 0:
    l_known = ls_known[0]
    resp['native_id'] = l_known.language.id
    resp['native_language'] = l_known.language.language_name

  if len(ls_wanted) > 0:
    l_wanted = ls_wanted[0]
    resp['learning_id'] = l_wanted.language.id
    resp['learning_language'] = l_wanted.language.language_name

  return resp
