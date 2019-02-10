export const LOGIN_REQUESTED = 'LOGIN_REQUESTED';
export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const LOGOUT_REQUESTED = 'LOGOUT_REQUESTED';
export const LOGOUT_SUCCEEDED = 'LOGOUT_SUCCEEDED';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';

export const AUTH_STATE_CHANGED = 'AUTH_STATE_CHANGED';

export const changeAuthState = (user) => ({
  type: AUTH_STATE_CHANGED,
  user
})

export const loginUser = (email, password) => ({
  type: LOGIN_REQUESTED,
  email,
  password
});

export const logoutUser = () => ({
  type: LOGOUT_REQUESTED
});