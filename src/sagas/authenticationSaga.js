import { takeEvery, put } from 'redux-saga/effects';
import { NotificationManager } from 'react-notifications';
import * as firebase from 'firebase';
import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGOUT_REQUESTED,
  LOGOUT_SUCCEEDED,
  LOGOUT_FAILED,
  AUTH_STATE_CHANGED,
  INITIALIZE_SOCIALS_REQUESTED,
  INITIALIZE_SOCIALS_SUCCEEDED,
} from '../actions/authenticationActions';

import { FB } from 'fb-es5';
import SocialMediasHandler from '../js/SocialMediasHandler';
var Twitter = require('twitter');
const config = require('../config.json');

function* changeAuthState() {
  if (firebase.auth().currentUser) {
    const token = yield firebase.auth().currentUser.getIdToken();
    yield put({ type: LOGIN_SUCCEEDED, token });
    yield put ({
      type: INITIALIZE_SOCIALS_REQUESTED,
      urls: {
        serverUrl: config.serverUrl,
        proxyUrl: config.proxyUrl
      },
      accessToken: token
    });

    console.log(token);
  } else
    yield put({ type: LOGIN_FAILED });
}

function* loginUser(action) {
  try {
    yield firebase.auth().signInWithEmailAndPassword(action.email, action.password);
  } catch (e) {
    console.log(e);
    switch (e.code) {
      case 'auth/invalid-email':
        NotificationManager.error('O email inserido é inválido!', 'Ah não...', 4000);
        break;
  
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        NotificationManager.error('Usuário ou senha incorreta!', 'Ah não...', 4000);
        break;
  
      default:
        NotificationManager.error('Algo de errado aconteceu, tente novamente.', 'Ah não...', 4000);
        break;
    }
  
    yield put ({ type: LOGIN_FAILED })
  }
}

function* logout(action) {
  try {
    yield firebase.auth().signOut();
    yield put ({ type: LOGOUT_SUCCEEDED });
  } catch {
    yield put ({ type: LOGOUT_FAILED })
  }
}

function* initializeSocials(action) {
  const response = yield fetch(action.urls.serverUrl + '/admins/tokens', {
    headers: new Headers({
      Authorization: 'Bearer ' + action.accessToken
    })
  }).then(raw => raw.json());

  FB.setAccessToken(response.fb_token_key);
  let tt = new Twitter({
    consumer_key: response.tt_consumer_key,
    consumer_secret: response.tt_consumer_secret,
    access_token_key: response.tt_token_key,
    access_token_secret: response.tt_token_secret
  });

  yield put ({
    type: INITIALIZE_SOCIALS_SUCCEEDED,
    socialMediasHandler: new SocialMediasHandler(tt, FB, {
      serverUrl: action.urls.serverUrl,
      proxyUrl: action.urls.proxyUrl,
      token: action.accessToken
    })
  });
}

const saga = [
  takeEvery(INITIALIZE_SOCIALS_REQUESTED, initializeSocials),
  takeEvery(AUTH_STATE_CHANGED, changeAuthState),
  takeEvery(LOGIN_REQUESTED, loginUser),
  takeEvery(LOGOUT_REQUESTED, logout)
];

export default saga;