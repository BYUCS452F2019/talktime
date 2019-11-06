import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  formControl: {
    minWidth: 375,
    maxWidth: 700,
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Settings() {
  const classes = useStyles();
  const [languageWanted, setLanguageWanted] = React.useState([]);
  const [nativeLanguage, setNativeLanguage] = React.useState([]);
  const [timezone, setTimezone] = React.useState([]);
  const [timezoneOptions, setTimezoneOptions] = React.useState([]);
  const [languageOptions, setLanguageOptions] = React.useState([]);

  useEffect(() => {
    fetch("/api/get_languages")
      .then(payload => payload.json())
      .then(res => {
        setLanguageOptions(res.map(r => { return { id: r.id, name: r.language_name } }))
      })
  }, [])

  useEffect(() => {
    fetch("/api/get_user", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer: ' + localStorage.getItem("auth")
      },
    })
      .then(payload => payload.json())
      .then(res => {
        setLanguageWanted(res.learning_id)
        setNativeLanguage(res.native_id)
        document.getElementById("username").value = res.user_name
        document.getElementById("email").value = res.email
      })
  }, [])

  useEffect(() => {
    fetch("/api/get_timezones")
      .then(payload => payload.json())
      .then(res => {
        setTimezoneOptions(res.map(r => { return { id: r.id, name: r.timezone_name, offset: r.timezone_offset } }))
      })
  }, [])

  function updateUserInfo() {
    let body = {
      user_name: document.getElementById("username").value,
      email: document.getElementById("email").value,
      wanted_language: document.getElementById("language_wanted").value,
      native_language: document.getElementById("native_language").value,
      pref_timezone: document.getElementById("timezone").value
    }

    fetch("/api/update_user", {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer: ' + localStorage.getItem("auth")
      },
      body: JSON.stringify(body)
    }).then(payload => payload.json())
      .then(result => {
        if (result.message == "success") {
          // TODO need to log out the user if username was changed
          alert("User information successfully updated.")
        } else {
          alert("Unable to update user information")
        }
      })
  }

  function handleLanguageWantedChange(event) {
    setLanguageWanted(event.target.value);
  }

  function handleNativeLanguageChange(event) {
    setNativeLanguage(event.target.value)
  }

  function handleTimezoneChange(event) {
    setTimezone(event.target.value)
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Settings
          </Typography>
          <br />
          <br />
          <br />
          <React.Fragment>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-chip">Native Language</InputLabel>
                  <Select
                    id="native_language"
                    value={nativeLanguage}
                    onChange={handleNativeLanguageChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue=
                      {selected => {
                        return languageOptions.filter(x => x.id == selected)[0].name
                      }}
                    MenuProps={MenuProps}
                  >
                    {languageOptions.map(language =>
                      <MenuItem key={language.id} value={language.id}>
                        {language.name}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-chip">Novice Language</InputLabel>
                  <Select
                    id="language_wanted"
                    value={languageWanted}
                    onChange={handleLanguageWantedChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue=
                      {selected => {
                        return languageOptions.filter(x => x.id == selected)[0].name
                      }}
                    MenuProps={MenuProps}
                  >
                    {languageOptions.map(language =>
                      <MenuItem key={language.id} value={language.id}>
                        {language.name}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-chip">Timezone</InputLabel>
                  <Select
                    id="timezone"
                    value={timezone}
                    onChange={handleTimezoneChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue=
                      {selected => {
                        return timezoneOptions.filter(x => x.id == selected)[0].name
                      }}
                    MenuProps={MenuProps}
                  >
                    {timezoneOptions.map(timezone =>
                      <MenuItem key={timezone.id} value={timezone.id}>
                                        {timezone.name}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <br />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => updateUserInfo()}
            >
              Update Settings
            </Button>
         </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}
