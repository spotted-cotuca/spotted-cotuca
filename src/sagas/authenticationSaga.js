import { takeEvery, put } from 'redux-saga/effects';
import { NotificationManager } from 'react-notifications';
import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGOUT_REQUESTED,
  LOGOUT_SUCCEEDED,
  VERIFY_AUTH_STATE
} from '../actions/authenticationActions';

const config = require('../config.json');

function* verifyAuthState() {
  let token = localStorage.getItem('authenticationToken')
  if (token)
    yield put({ type: LOGIN_SUCCEEDED, token });
  else
    yield put({ type: LOGIN_FAILED });
}

function* loginUser({ email, password }) {
  const response = yield fetch(`${config.serverUrl}/v1/sign-in`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    const message = yield response.text()
    NotificationManager.error(message, 'Ah não...', 4000);
    return yield put ({ type: LOGIN_FAILED })
  }

  const body = yield response.json()
  const token = body.token

  localStorage.setItem('authenticationToken', token)
  yield put ({ type: LOGIN_SUCCEEDED, token })
}

function* logout() {
  localStorage.removeItem('authenticationToken')
  yield put ({ type: LOGOUT_SUCCEEDED });
}

const saga = [
  takeEvery(VERIFY_AUTH_STATE, verifyAuthState),
  takeEvery(LOGIN_REQUESTED, loginUser),
  takeEvery(LOGOUT_REQUESTED, logout)
];

export default saga;