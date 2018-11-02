import React from 'react';
import PropTypes from 'prop-types';

import '../css/Spinner.css';

function Spinner(props) {
  return (
    <div className={'spinner' + (props.active === false ? '' : ' active')}>
      <div className="rotating-circle">
        <div className="circle-left">
          <div style={{ borderLeftColor: props.color }}/>
        </div>
        <div className="circle-right">
          <div style={{ borderRightColor: props.color }}/>
        </div>
      </div>
    </div>
  );
}

Spinner.propTypes = {
  color: PropTypes.string,
  active: PropTypes.bool
};

export default Spinner;