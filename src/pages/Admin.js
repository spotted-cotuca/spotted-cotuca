import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import yawp from 'yawp';
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

    yawp.config(c => c.baseUrl(props.serverUrl));
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
    fetch(this.props.serverUrl + '/spots/pending', {
      headers: new Headers({
        Authorization: 'Bearer ' + token
      })
    }).then(raw => raw.json())
      .then(response => {
        this.setState({
          spots: response.reverse().map(spot => 
            <SpotBox
              key={spot.id}
              approveSpot={() => this.approveSpot(spot.id, spot.message)}
              rejectSpot={() => this.rejectSpot(spot.id)}
              {...spot}
              date={new Date(spot.date)}
            />
          ),
          token: token,
          loaded: true
        });
      });
  }

  async approveSpot(id, spotMessage) {
    let post = await this.props.socialMedias.postOnSocialMedias(id, spotMessage);

    if (post.twitter && post.facebook) {
      NotificationManager.success('Spot postado com sucesso.', 'Aí sim!', 2000);

      fetch(this.props.serverUrl + id + '/approve', {
        method: 'PUT',
        headers: new Headers({
          Authorization: 'Bearer ' + this.state.token
        })
      }).then(() => this.selectSpots(this.state.token));
    } else if (!(post.twitter || post.facebook))
      NotificationManager.error('Algo de errado aconteceu, o spot não foi postado em nenhum lugar', 'Ah não...', 2000);
    else
      NotificationManager.error('Algo de errado aconteceu, mas o spot foi postado no ' + (post.facebook ? 'Facebook.' : 'Twitter.'), 'Ah não...', 2000);
  }

  rejectSpot(id) {
    fetch(this.props.serverUrl + id + '/reject', {
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.state.token
      })
    }).then(() => {
      NotificationManager.success('Spot rejeitado com sucesso.', 'Aí sim!', 2000);
      this.selectSpots(this.state.token);
    });
  }

  login = () => {
    let email = document.getElementById("email").value,
        pass  = document.getElementById("pass").value;
    
    this.props.loginUser(email, pass);
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
          <input type="email" id="email" name="email" placeholder="Email"/>
          <input type="password" id="pass" name="pass" placeholder="Senha"/>
          <button className="btn" onClick={this.login} disabled={logging}>
            Entrar
            <Spinner active={logging} color="#FFF"/>
          </button>
        </div>
      );
  }
}

export default connect(
  state => ({ 
    auth: state.authentication,
    socialMedias: state.authentication.socialMediasHandler
  }),
  { loginUser, logoutUser }
)(Admin);
