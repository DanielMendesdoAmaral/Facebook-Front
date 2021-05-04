import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import IconeGoogle from "./assets/google.svg";

import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBH2B1_I5CQxNy4Okj2Bv25vc93I-_CrXQ",
    authDomain: "facebook-api-6163f.firebaseapp.com",
    projectId: "facebook-api-6163f",
    storageBucket: "facebook-api-6163f.appspot.com",
    messagingSenderId: "559762799052",
    appId: "1:559762799052:web:83ec30cd0f83020ae64569"
  };

firebase.initializeApp(firebaseConfig);

//É o provedor da autorização.. poderia ser o facebook, github, etc.
const provider = new firebase.auth.GoogleAuthProvider();
//O que esse cliente terá acesso.. por exemplo, ler senha, ler contatos, etc. Pesquise por google scops pra saber mais opções.
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1615615289002-dd8b244997c5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const classes = useStyles();

  const entrarComGoogle = () => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
            firebase
                .auth()
                .currentUser
                .getIdToken()
                .then(token => {
                    fetch("http://localhost:5000/usuario", {
                      headers: {
                        "authorization": `Bearer ${token}`,
                        "x-custom-header": "Google"
                      }
                    })
                    .then(r => r.json())
                    .then(data => {
                      let token = {
                        token: token,
                        issuer: "Google"
                      }
                      localStorage.setItem("jwt", token)
                    })
                })
        });
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Entrar
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{background: "white", color: "black"}}
              onClick={entrarComGoogle()}
            >
              <img src={IconeGoogle} width={15} style={{marginRight: 10}}/> Entrar com Google
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              style={{background: "black", color: "white"}}
            >
                <i class="fab fa-github-alt" style={{marginRight: 10}}></i> Entrar com GitHub
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}