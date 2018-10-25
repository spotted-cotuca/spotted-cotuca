import React from 'react';
import PropTypes from 'prop-types';

import approveIcon from '../imgs/approve.png';
import rejectIcon from '../imgs/reject.png';

function AdminFooter(props) {
  return (
    <div className="spotBoxFooter">
      <img alt="approve" className="changeStatus" src={ approveIcon } onClick={ props.approveSpot }></img>
      <img alt="reject" className="changeStatus" src={ rejectIcon } onClick={ props.rejectSpot }></img>
    </div>
  );
}

AdminFooter.propTypes = {
  approveSpot: PropTypes.func.isRequired,
  rejectSpot: PropTypes.func.isRequired
}

export default AdminFooter;