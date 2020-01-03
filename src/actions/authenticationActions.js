export const LOGIN_REQUESTED = 'LOGIN_REQUESTED';
export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED';
export const LOGOUT_SUCCEEDED = 'LOGOUT_SUCCEEDED';

export const VERIFY_AUTH_STATE = 'VERIFY_AUTH_STATE';

export const verifyAuthState = () => ({
  type: VERIFY_AUTH_STATE
})

export const loginUser = (email, password) => ({
  type: LOGIN_REQUESTED,
  email,
  password
});

export const logoutUser = () => ({
  type: LOGOUT_REQUESTED
});