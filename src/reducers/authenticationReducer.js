import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGOUT_SUCCEEDED
} from '../actions/authenticationActions';

function authentication(state = { token: null, logged: false, logging: true }, action) {
  switch (action.type) {
    case LOGIN_SUCCEEDED:
      return {
        ...state,
        logged: true,
        logging: false,
        token: action.token
      }
    case LOGIN_REQUESTED:
      return {
        ...state,
        logging: true
      }
    case LOGIN_FAILED:
      return {
        ...state,
        logged: state.logged,
        logging: false
      }
    case LOGOUT_SUCCEEDED:
      return {
        ...state,
        logged: false,
        token: null
      }
    default:
      return state;
  }
}

export default authentication;