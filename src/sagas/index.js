import { all } from 'redux-saga/effects';
import authenticationSaga from './authenticationSaga';

export default function*() {
  yield all([
    ...authenticationSaga,
  ]);
}