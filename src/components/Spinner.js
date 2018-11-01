import React from 'react';

import '../css/Spinner.css';

function Spinner(props) {
  return (
    <div className="spinner">
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

export default Spinner;