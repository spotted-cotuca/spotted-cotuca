import React, { Component } from 'react';
import yawp from 'yawp';
import './Admin.css';

import approveIcon from '../../imgs/approve.png';
import rejectIcon from '../../imgs/reject.png';

import $ from 'jquery';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';

var config = 
{
    apiKey: "AIzaSyAwEx4ct_nKPYIhFBpfB7RMfSIHFme9ais",
    authDomain: "new-spotted-cotuca.firebaseapp.com",
    databaseURL: "https://new-spotted-cotuca.firebaseio.com",
    projectId: "new-spotted-cotuca",
    storageBucket: "new-spotted-cotuca.appspot.com",
    messagingSenderId: "319156712141"
};
firebase.initializeApp(config);

class Admin extends Component 
{
  constructor(props)
  {
    super(props);
    
    yawp.config(function (c) {
      c.baseUrl('http://new-spotted-cotuca.appspot.com/api');
    });
    
    this.selectSpots();
    
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) 
          user.getIdToken().then(this.checkAuth);
      else 
          console.error('No user, mate!');
    });
    this.configureFirebaseLoginWidget();
  };
  
  componentDidMount() 
  {
    document.title = "Spotted Cotuca";
  }

  state =
  {
    spots: []  
  }
  
  selectSpots()
  {
    yawp('/spots/pending').list(l => this.setState({spots: l}));
  }

  printSpots()
  {
    let spotsDivs =[];
    this.state.spots.forEach(spot => 
    {
      spotsDivs.push(this.createSpotBox(spot));
    });
    
    return spotsDivs;
  }

  createSpotBox(spot)
  {
    return (
      <div className="spotBox"> 
        <p className="date">
          { spot.date }
        </p>
       
        { "\"" + spot.message + "\"" } 
        
        <hr/>
        
        <div className="spotBoxFooter">
          <img alt="approve" className="changeStatus" src={ approveIcon } onClick={ () => this.approveSpot(spot.id) }></img>
          <img alt="reject" className="changeStatus" src={ rejectIcon } onClick={ () => this.rejectSpot(spot.id) }></img>
        </div>
      </div>
    );
  }

  approveSpot(id)
  {
    yawp(id).put("approve").then(() => this.selectSpots());
  }

  rejectSpot(id)
  {
    yawp(id).put("reject").then(() => this.selectSpots());
  }

  configureFirebaseLoginWidget() 
  {
    const uiConfig = {
        'signInSuccessUrl': '/',
        'signInOptions': [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ]
    };
    
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }

  checkAuth(idToken)
  {
    var settings = 
    {
      "async": true,
      "crossDomain": true,
      "url": "https://new-spotted-cotuca.appspot.com/api/admins",
      "method": "GET",
      "headers":
      {
        "Authorization": "Bearer " + idToken,
        "Cache-Control": "no-cache"
      }
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  }

  render() 
  {
    return (
      <div className="App">
        <header className="App-header">
          <a href="./"><h1 className="App-title">Spotted Cotuca</h1></a>
        </header>
        <div id="firebaseui-auth-container"></div>
        <div className="content">
          {
            this.printSpots()
          }
        </div>
      </div>
    );
  }
}

export default Admin;
