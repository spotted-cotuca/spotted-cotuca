import {
  combineReducers
} from 'redux';
import authentication from './authenticationReducer';
import spots from './spotsReducer';

export default combineReducers({
  authentication,
  spots
});