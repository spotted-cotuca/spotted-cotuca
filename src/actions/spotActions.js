export const APPROVE_SPOT = 'APPROVE_SPOT';
export const REJECT_SPOT = 'REJECT_SPOT';
export const DELETE_SPOT = 'DELETE_SPOT';

export const SEND_SPOT_REQUESTED = 'SEND_SPOT_REQUESTED';
export const SEND_SPOT_FINISHED = 'SEND_SPOT_FINISHED';

export const APPROVED_SPOTS_FETCH_REQUESTED = 'APPROVED_SPOTS_FETCH_REQUESTED';
export const APPROVED_SPOTS_FETCH_SUCCEEDED = 'APPROVED_SPOTS_FETCH_SUCCEEDED';
export const APPROVED_SPOTS_FETCH_FAILED = 'APPROVED_SPOTS_FETCH_FAILED';

export const PENDING_SPOTS_FETCH_REQUESTED = 'PENDING_SPOTS_FETCH_REQUESTED';
export const PENDING_SPOTS_FETCH_SUCCEEDED = 'PENDING_SPOTS_FETCH_SUCCEEDED';
export const PENDING_SPOTS_FETCH_FAILED = 'PENDING_SPOTS_FETCH_FAILED';

export const approveSpot = (creationDate, id) => ({
  type: APPROVE_SPOT,
  creationDate,
  id
})

export const rejectSpot = (creationDate, id) => ({
  type: REJECT_SPOT,
  creationDate,
  id
});

export const deleteSpot = (creationDate, id) => ({
  type: DELETE_SPOT,
  creationDate,
  id
});

export const sendSpot = (textArea) => ({
  type: SEND_SPOT_REQUESTED,
  textArea
});

export const fetchApprovedSpots = () => ({ type: APPROVED_SPOTS_FETCH_REQUESTED });

export const fetchPendingSpots = () => ({ type: PENDING_SPOTS_FETCH_REQUESTED });
