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
  return store.getState().authentication.token
}

function* approveSpot({ creationDate, id }) {
  const response = yield fetch(`${config.serverUrl}/v1/spots/${creationDate}/${id}/approve`, {
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
  const response = yield fetch(`${config.serverUrl}/v1/spots/${creationDate}/${id}/reject`, {
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

}

function* sendSpot({ message }) {

}

function* fetchApproved() {
  
}

function* fetchPending() {
  const response = yield fetch(`${config.serverUrl}/v1/spots/pending`, {
    headers: new Headers({ Authorization: `Bearer ${getToken()}` })
  })

  if (!response.ok) {
    NotificationManager.error('Algo de errado aconteceu ao listar os spots pendentes.', 'Ah não...', 2000);
    yield put({ type: PENDING_SPOTS_FETCH_FAILED });
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