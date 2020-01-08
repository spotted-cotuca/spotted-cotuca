import { takeEvery, put } from 'redux-saga/effects';
import { NotificationManager } from 'react-notifications';
import {
  APPROVE_SPOT,
  REJECT_SPOT,
  DELETE_SPOT,

  SEND_SPOT_REQUESTED,
  SEND_SPOT_FINISHED,

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

function createErrorMessage(message) {
  NotificationManager.error(message, 'Ah não...', 4000);
}

function createSuccessAlert(message) {
  NotificationManager.success(message, 'Aí sim!', 4000);
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

function* sendSpot({ textArea }) {
  let text = textArea.value.trim();
  let betweenQuotes = text.match(/^["“'](.|\n)*["”']$/);
  let removeQuotes = betweenQuotes && text.match(/["“”']/g).length <= 2;

  if (removeQuotes)
    text = text.substring(1, text.length - 1);

  text = text.trim();
  if (text === '')
    return createErrorMessage('Se você não escrever nada, não tem como o crush te notar!');
  else if (text.length > 278)
    return createErrorMessage('Somos integrados com o Twitter, logo, não podemos aceitar spots com mais de 280 caracteres 😢');

  const response = yield fetch(`${config.serverUrl}/v1/spots`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ message: text })
  })

  if (!response.ok) {
    createErrorMessage('Algo de errado ocorreu ao tentar enviar o spot, por favor, tente novamente e verifique sua conexão');
    yield put({ type: SEND_SPOT_FINISHED });
    return;
  }

  textArea.value = '';
  let testText = text.toUpperCase();
  if (removeQuotes) {
    createSuccessAlert('Pode deixar que nós já colocamos as aspas para você, elas foram removidas e sua mensagem enviada 😊');
  } else if (testText.includes('NA PD')) {
    createSuccessAlert('Sua mensagem foi enviada, agora manda seu crush pagar a PD também!');
  } else if (testText.includes('NÃO ME QUER') || testText.includes('NÃO ME NOTA')) {
    createSuccessAlert('Sua mensagem foi enviada, E É CLARO QUE SEU CRUSH TE QUER!');
  } else {
    createSuccessAlert('Sua mensagem foi enviada, agora é só esperar!');
  }

  yield put({ type: SEND_SPOT_FINISHED });
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
  takeEvery(SEND_SPOT_REQUESTED, sendSpot),

  takeEvery(PENDING_SPOTS_FETCH_REQUESTED, fetchPending),
  takeEvery(APPROVED_SPOTS_FETCH_REQUESTED, fetchApproved)
];

export default saga;