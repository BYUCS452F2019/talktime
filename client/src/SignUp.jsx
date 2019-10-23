import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  formControl: {
    minWidth: 375,
    maxWidth: 700,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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

export default function SignUp() {
  const classes = useStyles();
  const history = useHistory();
  const [languages, setLanguages] = React.useState([]);
  const [languageOptions, setLanguageOptions] = React.useState(["Placeholder1", "Placerholder2"]);

  useEffect(() => {
    fetch("api/get_languages")
      .then(payload => payload.json())
      .then(res => {
        setLanguageOptions(res.map(r => { return { id: r.id, name: r.name } }))
      })
  }, [])

  function handleChange(event) {
    setLanguages(event.target.value);
  }

  function handleChangeMultiple(event) {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setLanguages(value);
  }

  function register() {
    let body = {
      user_name: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      pref_timezone: "none"
    }

    fetch("/api/register", {
      method: "POST",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(result => {
        if (result.authenticated) {
          localStorage.setItem("auth", result.token)
          history.push("/home")
        } else {
          alert("Registration unsuccessful")
        }
      })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <br />
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
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-multiple-chip">Languages</InputLabel>
              <Select
                multiple
                value={languages}
                onChange={handleChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(value => (
                      <Chip key={value.id} label={value.name} className={classes.chip} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {languageOptions.map(language => (
                  <MenuItem key={language.id} value={language}>
                    {language.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> 
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => register()}
        >
          Sign Up
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
