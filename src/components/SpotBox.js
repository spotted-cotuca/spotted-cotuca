import React, { Component } from 'react';

import fbIcon from '../../imgs/fb.png';
import ttIcon from '../../imgs/tt.png';

class SpotBox extends Component {
  constructor(props) {
    super(props);
    let serverDate = new Date(props.date);
    let date = new Date(serverDate);
    date.setMinutes(serverDate.getMinutes() - serverDate.getTimezoneOffset());
    
    let d = date.getDate();
    let m = date.getMonth() + 1;
    
    let h = date.getHours();
    let min = date.getMinutes();

    this.date = (d > 9 ? '' : '0') + d + '/' + (m > 9 ? '' : '0') + m + '/' + date.getFullYear() + ' - ' +
                (h > 9 ? '' : '0') + h + 'h' + (min > 9 ? '' : '0') + min
  }

  render() {
    <div className="spotBox"> 
      <p className="date">
        { this.date }
      </p>
      
      { "\"" + this.props.message + "\"" } 
      
      <hr/>
      
      <div className="spotBoxFooter">
        <a href={ "https://www.facebook.com/pg/spottedcotuca3/posts/" + this.props.fbPostId } target="blank"><img alt="fb" className="socialMedia" src={ fbIcon }></img></a>
        <a href={ "https://twitter.com/spottedcotuca3/status/" + this.props.ttPostId } target="blank"><img alt="tt" className="socialMedia" src={ ttIcon }></img></a>
      </div>
    </div>
  }
}

export default SpotBox;