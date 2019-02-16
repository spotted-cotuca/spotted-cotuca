import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGOUT_SUCCEEDED,
  INITIALIZE_SOCIALS_SUCCEEDED
} from '../actions/authenticationActions';

function authentication(state = { token: null, logged: false, logging: true, socialMediasHandler: null }, action) {
  switch (action.type) {
    case INITIALIZE_SOCIALS_SUCCEEDED:
      return {
        ...state,
        socialMediasHandler: action.socialMediasHandler
      };
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
        token: null,
        socialMediasHandler: null
      }
    default:
      return state;
  }
}

export default authentication;