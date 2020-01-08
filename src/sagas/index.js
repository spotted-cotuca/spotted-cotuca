import { all } from 'redux-saga/effects';
import authenticationSaga from './authenticationSaga';
import spotSaga from './spotSaga';

export default function*() {
  yield all([
    ...authenticationSaga,
    ...spotSaga
  ]);
}