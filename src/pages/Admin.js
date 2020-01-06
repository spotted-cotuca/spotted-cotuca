import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { loginUser, logoutUser } from '../actions/authenticationActions';

import SpotBox from '../components/SpotBox';
import Spinner from '../components/Spinner';

import 'react-notifications/lib/notifications.css';
import '../css/Admin.css';

class Admin extends Component {
  socialMedias = null;

  constructor(props) {
    super(props);
    this.state = {
      spots: [],
      loaded: false
    };
  }

  componentDidMount() {
    const { token } = this.props.auth;
    if (token)
      this.selectSpots(token);
  }

  componentDidUpdate(prevProps) {
    const { token } = this.props.auth;
    if (token && !prevProps.auth.token)
      this.selectSpots(token);
  }

  selectSpots(token) {
    fetch(`${this.props.serverUrl}/v1/spots/pending`, {
      headers: new Headers({
        Authorization: 'Bearer ' + token
      })
    }).then(raw => raw.json())
      .then(response => {
        this.setState({
          spots: response.reverse().map(spot => {
            const date = spot.createdAt.split('T')[0]
            return <SpotBox
              key={spot.id}
              approveSpot={() => this.approveSpot(date, spot.id)}
              rejectSpot={() => this.rejectSpot(date, spot.id)}
              {...spot}
              date={new Date(spot.createdAt)}
            />
          }),
          token: token,
          loaded: true
        });
      })
      .catch(() => {
        NotificationManager.error('Algo de errado aconteceu ao listar os spots pendentes.', 'Ah não...', 2000);
        this.setState({ loaded: true });
      });
  }

  async approveSpot(date, id) {
    const response = await fetch(`${this.props.serverUrl}/v1/spots/${date}/${id}/approve`, {
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.state.token,
        'Content-Type': 'application/json'
      })
    })

    if (!response.ok) {
      NotificationManager.error('Algo de errado aconteceu ao aprovar spot.', 'Ah não...', 2000);
      return;
    }

    NotificationManager.success('Spot postado com sucesso.', 'Aí sim!', 2000);
    this.selectSpots(this.state.token);
  }

  async rejectSpot(date, id) {
    const response = await fetch(`${this.props.serverUrl}/v1/spots/${date}/${id}/reject`, {
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.state.token,
        'Content-Type': 'application/json'
      })
    });

    if (!response.ok) {
      NotificationManager.error('Falha ao rejeitar spot.', 'Ah não...', 2000);
      return;
    }

    NotificationManager.success('Spot rejeitado com sucesso.', 'Aí sim!', 2000);
    this.selectSpots(this.state.token);
  }

  login = () => {
    let username = document.getElementById("username").value,
        password = document.getElementById("password").value;
    
    this.props.loginUser(username, password);
  }

  render() {
    const { logged, logging } = this.props.auth;
    const { logoutUser } = this.props;

    if (logged)
      return (
        <div className="content admin">
          <div className="options">
            <button className="btn" onClick={logoutUser}>
              Logout
            </button>
          </div>

          { !this.state.loaded && <Spinner /> }
          { this.state.spots }
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
  state => ({ auth: state.authentication }),
  { loginUser, logoutUser }
)(Admin);
