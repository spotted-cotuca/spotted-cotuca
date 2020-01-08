import {
  APPROVED_SPOTS_FETCH_REQUESTED,
  APPROVED_SPOTS_FETCH_SUCCEEDED,
  APPROVED_SPOTS_FETCH_FAILED,

  PENDING_SPOTS_FETCH_REQUESTED,
  PENDING_SPOTS_FETCH_SUCCEEDED,
  PENDING_SPOTS_FETCH_FAILED
} from '../actions/spotActions';

const initialState = { approvedSpots: null, pendingSpots: null, fetchingApproved: false, fetchingPending: false };

function spots(state = initialState, action) {
  switch (action.type) {
    case APPROVED_SPOTS_FETCH_REQUESTED:
      return {
        ...state,
        fetchingApproved: true
      }
    case APPROVED_SPOTS_FETCH_SUCCEEDED:
      return {
        ...state,
        approvedSpots: action.spots,
        fetchingApproved: false
      }
    case APPROVED_SPOTS_FETCH_FAILED:
      return {
        ...state,
        approvedSpots: null,
        fetchingApproved: false
      }

    case PENDING_SPOTS_FETCH_REQUESTED:
      return {
        ...state,
        fetchingPending: true
      }
    case PENDING_SPOTS_FETCH_SUCCEEDED:
      return {
        ...state,
        pendingSpots: action.spots,
        fetchingPending: false
      }
    case PENDING_SPOTS_FETCH_FAILED:
      return {
        ...state,
        pendingSpots: null,
        fetchingPending: false
      }
    default:
      return state;
  }
}

export default spots;