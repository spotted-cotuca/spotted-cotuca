import React from 'react';

import '../css/Spinner.css';

function Spinner(props) {
  return (
    <div className="spinner">
      <div className="rotating-circle">
        <div className="circle-left">
          <div />
        </div>
        <div className="circle-right">
          <div />
        </div>
      </div>
    </div>
  );
}

export default Spinner;