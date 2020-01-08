import { takeEvery, put } from 'redux-saga/effects';
import { NotificationManager } from 'react-notifications';
import {
  APPROVE_SPOT,
  REJECT_SPOT,
  DELETE_SPOT,
  SEND_SPOT,

  APPROVED_SPOTS_FETCH_REQUESTED,
  APPROVED_SPOTS_FETCH_SUCCEEDED,
  APPROVED_SPOTS_FETCH_FAILED,

  PENDING_SPOTS_FETCH_REQUESTED,
  PENDING_SPOTS_FETCH_SUCCEEDED,
  PENDING_SPOTS_FETCH_FAILED
} from '../actions/spotActions';

import store from '../store'

const config = require('../config.json');

function getToken() {
  return store.getState().authentication.token;
}

function localDateString(dateTime) {
  return dateTime.split('T')[0];
}

function* approveSpot({ creationDate, id }) {
  const date = localDateString(creationDate)
  const response = yield fetch(`${config.serverUrl}/v1/spots/${date}/${id}/approve`, {
    method: 'PUT',
    headers: new Headers({
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    })
  })

  if (!response.ok) {
    NotificationManager.error('Algo de errado aconteceu ao aprovar spot.', 'Ah não...', 2000);
    return;
  }

  NotificationManager.success('Spot postado com sucesso.', 'Aí sim!', 2000);
  yield put ({ type: PENDING_SPOTS_FETCH_REQUESTED })
}

function* rejectSpot({ creationDate, id }) {
  const date = localDateString(creationDate)
  const response = yield fetch(`${config.serverUrl}/v1/spots/${date}/${id}/reject`, {
    method: 'PUT',
    headers: new Headers({
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    })
  });

  if (!response.ok) {
    NotificationManager.error('Falha ao rejeitar spot.', 'Ah não...', 2000);
    return;
  }

  NotificationManager.success('Spot rejeitado com sucesso.', 'Aí sim!', 2000);
  yield put ({ type: PENDING_SPOTS_FETCH_REQUESTED })
}

function* deleteSpot({ creationDate, id }) {
  const date = localDateString(creationDate)
  const response = yield fetch(`${config.serverUrl}/v1/spots/${date}/${id}`, {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    })
  });

  if (!response.ok) {
    NotificationManager.error('Algo de errado aconteceu', 'Ah não...', 2000);
    return;
  }

  NotificationManager.success('Spot deletado com sucesso.', 'Aí sim!', 2000);
  yield put ({ type: APPROVED_SPOTS_FETCH_REQUESTED })
}

function* sendSpot({ message }) {

}

function* fetchApproved() {
  const response = yield fetch(`${config.serverUrl}/v1/spots/approved`);

  if (!response.ok) {
    NotificationManager.error('Algo de errado aconteceu ao listar os spots.', 'Ah não...', 4000);
    yield put({ type: APPROVED_SPOTS_FETCH_FAILED });
    return;
  }

  const spots = yield response.json()
  yield put({ type: APPROVED_SPOTS_FETCH_SUCCEEDED, spots });
}

function* fetchPending() {
  const response = yield fetch(`${config.serverUrl}/v1/spots/pending`, {
    headers: new Headers({ Authorization: `Bearer ${getToken()}` })
  })

  if (!response.ok) {
    NotificationManager.error('Algo de errado aconteceu ao listar os spots pendentes.', 'Ah não...', 2000);
    yield put({ type: PENDING_SPOTS_FETCH_FAILED });
    return;
  }

  const spots = yield response.json()
  yield put({ type: PENDING_SPOTS_FETCH_SUCCEEDED, spots: spots.reverse() });
}

const saga = [
  takeEvery(APPROVE_SPOT, approveSpot),
  takeEvery(REJECT_SPOT, rejectSpot),
  takeEvery(DELETE_SPOT, deleteSpot),
  takeEvery(SEND_SPOT, sendSpot),

  takeEvery(PENDING_SPOTS_FETCH_REQUESTED, fetchPending),
  takeEvery(APPROVED_SPOTS_FETCH_REQUESTED, fetchApproved)
];

export default saga;