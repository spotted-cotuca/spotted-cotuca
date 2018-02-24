import React, { Component } from 'react';
import yawp from 'yawp';
import { FB, FacebookApiException } from 'fb';
import * as firebase from 'firebase';
import $ from 'jquery';

import approveIcon from '../../imgs/approve.png';
import rejectIcon from '../../imgs/reject.png';

import './Admin.css';

var config = 
{
    apiKey: "AIzaSyAwEx4ct_nKPYIhFBpfB7RMfSIHFme9ais",
    authDomain: "new-spotted-cotuca.firebaseapp.com",
    databaseURL: "https://new-spotted-cotuca.firebaseio.com",
    projectId: "new-spotted-cotuca",
    storageBucket: "https://new-spotted-cotuca.appspot.com",
    messagingSenderId: "319156712141"
};

//window.addEventListener("unload", () => firebase.auth().signOut());

class Admin extends Component 
{
  constructor(props)
  {
    super(props);
    
    yawp.config(function (c) {
      c.baseUrl('https://new-spotted-cotuca.appspot.com/api');
    });
    
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) 
        user.getIdToken().then(function(idToken) { this.initializeFacebook(idToken); this.selectSpots(idToken); }.bind(this));
    }.bind(this));
  };
  
  componentDidMount() 
  {
    document.title = "Spotted Cotuca";
  }

  state =
  {
    spots: [],
    logged: false,
    token: '',
  }
  
  initializeFacebook(idToken)
  {
    let settings = 
    {
      "async": true,
      "crossDomain": true,
      "url": "https://new-spotted-cotuca.appspot.com/api/admins/token",
      "method": "GET",
      "headers":
      {
        "Authorization": "Bearer " + idToken
      }
    }
    
    $.ajax(settings).done(function (response) {
      FB.setAccessToken(response.token);
    }.bind(this));
  }
  
  selectSpots(idToken)
  {
    let settings = 
    {
      "async": true,
      "crossDomain": true,
      "url": "https://new-spotted-cotuca.appspot.com/api/spots/pending",
      "method": "GET",
      "headers":
      {
        "Authorization": "Bearer " + idToken
      }
    }
    
    $.ajax(settings).done(function (response) {
      this.setState({ spots: response.reverse(), logged: true, token: idToken });
    }.bind(this));
  }

  printSpots()
  {
    let spotsDivs =[];
    this.state.spots.forEach(spot => spotsDivs.push(this.createSpotBox(spot)));
    
    return spotsDivs;
  }

  createSpotBox(spot)
  {
    let date = new Date(spot.date);
    
    let d = date.getDate();
    let m = date.getMonth() + 1;
    
    let h = date.getHours();
    let min = date.getMinutes();
    
    return (
      <div className="spotBox"> 
        <p className="date">
          { 
            (d > 9 ? '' : '0') + d + '/' + (m > 9 ? '' : '0') + m + '/' + date.getFullYear() + ' - ' +
            (h > 9 ? '' : '0') + h + 'h' + (min > 9 ? '' : '0') + min
          }
        </p>
       
        { "\"" + spot.message + "\"" } 
        
        <hr/>
        
        <div className="spotBoxFooter">
          <img alt="approve" className="changeStatus" src={ approveIcon } onClick={ () => this.approveSpot(spot.id, spot.message) }></img>
          <img alt="reject" className="changeStatus" src={ rejectIcon } onClick={ () => this.rejectSpot(spot.id) }></img>
        </div>
      </div>
    );
  }

  approveSpot(id, spotMessage)
  {
    let settings = 
    {
      "async": true,
      "crossDomain": true,
      "url": "https://new-spotted-cotuca.appspot.com/api" + id + "/approve",
      "method": "PUT",
      "headers":
      {
        "Authorization": "Bearer " + this.state.token
      }
    };
    
    $.ajax(settings).done(function (response) {
      FB.api('me/feed', 'post', { message: "\"" + spotMessage + "\"" }, function (res) 
      {
        if(!res || res.error)
          return;

        settings.url = "https://new-spotted-cotuca.appspot.com/api" + id + "/addPostId?postId=" + res.id.split('_')[1];
        $.ajax(settings);
      });
      
      this.selectSpots(this.state.token);
    }.bind(this));
  }

  rejectSpot(id)
  {
    let settings = 
    {
      "async": true,
      "crossDomain": true,
      "url": "https://new-spotted-cotuca.appspot.com/api" + id + "/reject",
      "method": "PUT",
      "headers":
      {
        "Authorization": "Bearer " + this.state.token
      }
    };
    
    $.ajax(settings).done(function (response) {
      this.selectSpots(this.state.token);
    }.bind(this));
  }

  login()
  {
    let email = document.getElementById("email").value,
        pass  = document.getElementById("pass").value;
    
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(e => console.log(e.message));
  }

  render() 
  {
    if (this.state.logged)
      return (
        <div className="App">
          <header className="App-header">
            <a href="./"><h1 className="App-title">Spotted Cotuca</h1></a>
          </header>
          
          <div className="content">
            {
              this.printSpots()
            }
          </div>
        </div>
      );
    else
      return (
        <div className="App">
          <header className="App-header">
            <a href="./"><h1 className="App-title">Spotted Cotuca</h1></a>
          </header>
          
          <div className="outer">
            <div className="middle">
              <div className="form-content">
                <div className="row">
                  <input type="text" id="email" name="email" placeholder="Email"/>
                </div>
                <div className="row">
                  <input type="password" id="pass" name="pass" placeholder="Senha"/>
                </div>
                <div className="row">
                  <button className="btn" onClick={ this.login }>Entrar</button>
                </div>
              </div>
            </div>
          </div>
          
          <footer className="user-footer">
            Feito com <i className="heart">♥</i> por <a className="fbLink" href="https://fb.com/igor.mandello" target="blank">Igor</a> e <a className="fbLink" href="https://fb.com/lorenzopincinato" target="blank">Lorenzo</a>
          </footer>
        </div>
      );
  }
}

export default Admin;
