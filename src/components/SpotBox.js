import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AdminFooter from './AdminFooter';
import UserFooter from './UserFooter';

class SpotBox extends Component {
  constructor(props) {
    super(props);
    props.date.setMinutes(props.date.getMinutes() - props.date.getTimezoneOffset());
    
    let d = props.date.getDate();
    let m = props.date.getMonth() + 1;
    
    let h = props.date.getHours();
    let min = props.date.getMinutes();

    this.date = (d > 9 ? '' : '0') + d + '/' + (m > 9 ? '' : '0') + m + '/' + props.date.getFullYear() + ' - ' +
                (h > 9 ? '' : '0') + h + 'h' + (min > 9 ? '' : '0') + min;

    if (props.admin)
      this.footer = <AdminFooter approveSpot={props.approveSpot} rejectSpot={props.rejectSpot} />;
    else
      this.footer = <UserFooter fbPostId={props.fbPostId} ttPostId={props.ttPostId} />;
  }

  render() {
    return (
      <div className="spotBox"> 
        <p className="date">
          { this.date }
        </p>
        { "\"" + this.props.message + "\"" } 
        <hr/>
        { this.footer }
      </div>
    );
  }
}

SpotBox.propTypes = {
  message: PropTypes.string.isRequired,
  fbPostId: PropTypes.string,
  ttPostId: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
  approveSpot:  PropTypes.func,
  rejectSpot: PropTypes.func,
  admin: PropTypes.bool
}

export default SpotBox;