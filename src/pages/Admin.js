import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginUser, logoutUser } from '../actions/authenticationActions';
import { approveSpot, rejectSpot, fetchPendingSpots } from '../actions/spotActions';

import SpotBox from '../components/SpotBox';
import Spinner from '../components/Spinner';

import 'react-notifications/lib/notifications.css';
import '../css/Admin.css';

class Admin extends Component {
  componentDidMount() {
    const { logged } = this.props.auth;
    if (logged)
      this.props.fetchPendingSpots();
  }

  componentDidUpdate(prevProps) {
    const { logged } = this.props.auth;
    if (logged && !prevProps.auth.logged)
      this.props.fetchPendingSpots();
  }

  renderSpots(spots) {
    if (!spots) return;

    return spots.map(spot => {
      return <SpotBox
        key={spot.id}
        approveSpot={() => this.props.approveSpot(spot.createdAt, spot.id)}
        rejectSpot={() => this.props.rejectSpot(spot.createdAt, spot.id)}
        {...spot}
        date={new Date(spot.createdAt)}
      />
    })
  }

  login = () => {
    let username = document.getElementById("username").value,
        password = document.getElementById("password").value;
    
    this.props.loginUser(username, password);
  }

  render() {
    const { logged, logging } = this.props.auth;
    const { pendingSpots, fetchingPending } = this.props.spots;

    if (logged)
      return (
        <div className="content admin">
          <div className="options">
            <button className="btn" onClick={this.props.logoutUser}>
              Logout
            </button>
          </div>

          { fetchingPending && !pendingSpots && <Spinner /> }
          { this.renderSpots(pendingSpots) }
        </div>
      );
    else
      return (
        <div className="content admin centralize">
          <input type="text" id="username" name="username" placeholder="Usuário"/>
          <input type="password" id="password" name="password" placeholder="Senha"/>
          <button className="btn" onClick={this.login} disabled={logging}>
            Entrar
            <Spinner active={logging} color="#FFF"/>
          </button>
        </div>
      );
  }
}

export default connect(
  state => ({ auth: state.authentication, spots: state.spots }),
  { loginUser, logoutUser, approveSpot, rejectSpot, fetchPendingSpots }
)(Admin);
