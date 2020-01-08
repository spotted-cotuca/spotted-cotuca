import { takeEvery, put } from 'redux-saga/effects';
import { NotificationManager } from 'react-notifications';
import {
  APPROVE_SPOT,
  REJECT_SPOT,
  DELETE_SPOT,
  SEND_SPOT
} from '../actions/spotActions';

import store from '../store'

const config = require('../config.json');

function* approveSpot({ creationDate, id }) {
  
}

function* rejectSpot({ creationDate, id }) {

}

function* deleteSpot({ creationDate, id }) {

}

function* sendSpot({ message }) {

}

const saga = [
  takeEvery(APPROVE_SPOT, approveSpot),
  takeEvery(REJECT_SPOT, rejectSpot),
  takeEvery(DELETE_SPOT, deleteSpot),
  takeEvery(SEND_SPOT, sendSpot)
];

export default saga;