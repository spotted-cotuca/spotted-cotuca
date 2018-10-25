import React, { Component } from 'react';
import yawp from 'yawp';
import { FB } from 'fb-es5';
import * as firebase from 'firebase';
import $ from 'jquery';

import SpotBox from '../components/SpotBox';

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
      token: '',
      consumer_key: '',
      consumer_secret: '',
      access_token_key: '',
      access_token_secret: '',
    };
  }

  componentDidMount() {
    firebase.initializeApp(this.props.firebase);
    firebase.auth().onAuthStateChanged(user => {
      if (user)
        user.getIdToken().then(idToken => {
          this.initializeSocials(idToken);
          this.selectSpots(idToken);
        });
    });
  }

  initializeSocials(idToken) {
    let settings =
      {
        "async": true,
        "crossDomain": true,
        "url": this.props.serverUrl + "/admins/tokens",
        "method": "GET",
        "headers":
          {
            "Authorization": "Bearer " + idToken
          }
      };

    let context = this;
    $.ajax(settings).done(function (response) {
      FB.setAccessToken(response.fb_token_key);

      context.tt = new Twitter({
        consumer_key: response.tt_consumer_key,
        consumer_secret: response.tt_consumer_secret,
        access_token_key: response.tt_token_key,
        access_token_secret: response.tt_token_secret
      });
    });

    console.log(idToken);
  }

  selectSpots(idToken) {
    fetch(this.props.serverUrl + '/spots/pending', {
      headers: new Headers({
        Authorization: 'Bearer ' + idToken
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
          logged: true,
          token: idToken
        });
      });
  }

  approveSpot(id, spotMessage) {
    let settings =
      {
        "async": true,
        "crossDomain": true,
        "url": this.props.serverUrl + id + "/approve",
        "method": "PUT",
        "headers":
          {
            "Authorization": "Bearer " + this.state.token
          }
      };

    let context = this;
    $.ajax(settings).done(function (response) {
      FB.api('me/feed', 'post', { message: "\"" + spotMessage + "\"" }, function (res) {
        if (!res || res.error)
          return;

        settings.url = context.props.serverUrl + id + "/addPostId?fbPostId=" + res.id.split('_')[1];
        $.ajax(settings).done(r => {
          let settings = {
            async: true,
            crossDomain: true,
            url: context.props.proxyUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
              "accessSecret": context.tt.options.access_token_secret,
              "accessToken": context.tt.options.access_token_key,
              "consumerKey": context.tt.options.consumer_key,
              "consumerSecret": context.tt.options.consumer_secret,
              "message": "\"" + spotMessage + "\""
            })
          }

          $.ajax(settings).done(r => {
            let settings =
              {
                "async": true,
                "crossDomain": true,
                "url": context.props.serverUrl + id + "/addPostId?ttPostId=" + r.tweetId,
                "method": "PUT",
                "headers":
                  {
                    "Authorization": "Bearer " + context.state.token
                  }
              };

            $.ajax(settings);
          })

          context.selectSpots(context.state.token);
        });
      });
    });
  }

  rejectSpot(id) {
    fetch(this.props.serverUrl + id + '/reject', {
      method: "PUT",
      headers: new Headers({
        Authorization: 'Bearer ' + this.state.token
      })
    }).then(() => this.selectSpots(this.state.token));
  }

  login() {
    let email = document.getElementById("email").value,
        pass = document.getElementById("pass").value;

    firebase.auth().signInWithEmailAndPassword(email, pass).catch(e => console.log(e.message));
  }

  logout() {
    firebase.auth().signOut();
    this.setState({ logged: false });
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
        <div className="content admin">
          <div className="middle">
            <div className="form-content">
              <div className="row">
                <input type="text" id="email" name="email" placeholder="Email" />
              </div>
              <div className="row">
                <input type="password" id="pass" name="pass" placeholder="Senha" />
              </div>
              <div className="row">
                <button className="btn" onClick={this.login}>Entrar</button>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export default Admin;
