import { takeEvery, put, call } from 'redux-saga/effects';
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
} from '../actions/authenticationActions';

function* changeAuthState() {
  if (firebase.auth().currentUser) {
    const token = yield firebase.auth().currentUser.getIdToken();
    yield put({ type: LOGIN_SUCCEEDED, token });

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

const saga = [
  takeEvery(AUTH_STATE_CHANGED, changeAuthState),
  takeEvery(LOGIN_REQUESTED, loginUser),
  takeEvery(LOGOUT_REQUESTED, logout)
];

export default saga;