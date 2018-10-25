import React from 'react';
import PropTypes from 'prop-types';

import fbIcon from '../imgs/fb.png';
import ttIcon from '../imgs/tt.png';

function UserFooter(props) {
  return (
    <div className="spotBoxFooter">
      <a href={ "https://www.facebook.com/pg/spottedcotuca3/posts/" + props.fbPostId } target="blank"><img alt="fb" className="socialMedia" src={ fbIcon }></img></a>
      <a href={ "https://twitter.com/spottedcotuca3/status/" + props.ttPostId } target="blank"><img alt="tt" className="socialMedia" src={ ttIcon }></img></a>
    </div>
  );
}

UserFooter.propTypes = {
  fbPostId: PropTypes.string.isRequired,
  ttPostId: PropTypes.string.isRequired
}

export default UserFooter;