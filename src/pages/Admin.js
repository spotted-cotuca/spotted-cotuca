import React, { Component } from 'react';
import yawp from 'yawp';
import { FB } from 'fb-es5';
import * as firebase from 'firebase';

import SpotBox from '../components/SpotBox';
import Spinner from '../components/Spinner';

import '../css/Admin.css';

var Twitter = require('twitter');

class Admin extends Component {
  tt = null;

  constructor(props) {
    super(props);

    yawp.config(c => c.baseUrl(props.serverUrl));
    this.state = {
      spots: [],
      logged: false,
      logging: false
    };
  }

  componentDidMount() {
    firebase.initializeApp(this.props.firebase);
    firebase.auth().onAuthStateChanged(user => {
      if (user)
        user.getIdToken().then(token => {
          console.log(token);
          this.initializeSocials(token);
          this.selectSpots(token);
        });
    });
  }

  initializeSocials(token) {
    fetch(this.props.serverUrl + '/admins/tokens', {
      headers: new Headers({
        Authorization: 'Bearer ' + token
      })
    }).then(raw => raw.json())
      .then(response => {
        FB.setAccessToken(response.fb_token_key);
        
        this.tt = new Twitter({
          consumer_key: response.tt_consumer_key,
          consumer_secret: response.tt_consumer_secret,
          access_token_key: response.tt_token_key,
          access_token_secret: response.tt_token_secret
        });
      });
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
              admin
            />
          ),
          token: token
        });
      });
  }

  approveSpot(id, spotMessage) {
    fetch(this.props.serverUrl + id + '/approve', {
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.state.token
      })
    }).then(() => {
      FB.api('me/feed', 'post', { message: '"' + spotMessage + '"' }, res => {
        if (!res || res.error)
          return;

        fetch(this.props.serverUrl + id + '/addPostId?fbPostId=' + res.id.split('_')[1], {
          method: 'PUT',
          headers: new Headers({
            Authorization: 'Bearer ' + this.state.token
          })
        }).then(() => {
          fetch(this.props.proxyUrl, {
            async: true,
            crossDomain: true,
            method: 'POST',
            contentType: 'application/json',
            body: JSON.stringify({
              accessSecret: this.tt.options.access_token_secret,
              accessToken: this.tt.options.access_token_key,
              consumerKey: this.tt.options.consumer_key,
              consumerSecret: this.tt.options.consumer_secret,
              message: '"' + spotMessage + '"'
            })
          }).then(raw => raw.json())
            .then(response => {
              fetch(this.props.serverUrl + id + '/addPostId?ttPostId=' + response.tweetId, {
                async: true,
                crossDomain: true,
                method: 'PUT',
                headers: new Headers({
                  Authorization: 'Bearer ' + this.state.token
                })
              })
            });

          this.selectSpots(this.state.token);
        });
      });
    });
  }

  rejectSpot(id) {
    fetch(this.props.serverUrl + id + '/reject', {
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + this.state.token
      })
    }).then(() => this.selectSpots(this.state.token));
  }

  login = () => {
    let email = document.getElementById("email").value,
        pass  = document.getElementById("pass").value;
    
    this.setState({
      logging: true
    });
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(() => {
        this.setState({
          logged: true,
          logging: false
        });
      })
      .catch(e => {
        console.log(e.message);
        this.setState({
          logging: false
        });
      });
  }

  logout() {
    firebase.auth().signOut();
    this.setState({
      logged: false
    });
  }

  render() {
    if (this.state.logged)
      return (
        <div className="content admin">
          <div className="Logout-btn">
            <a href="./" onClick={this.logout}><b>Logout</b></a>
          </div>
          { this.state.spots }
        </div>
      );
    else
      return (
        <div className="content admin centralize">
          <input type="text" id="email" name="email" placeholder="Email"/>
          <input type="password" id="pass" name="pass" placeholder="Senha"/>
          <button className="btn" onClick={this.login}>
            Entrar
            <Spinner active={this.state.logging} color="#FFF"/>
          </button>
        </div>
      );
  }
}

export default Admin;
