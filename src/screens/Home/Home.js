import React, { Component } from 'react';
import yawp from 'yawp';
import $ from 'jquery';

import '../../index.css';
import './Home.css';

import fbIcon from '../../imgs/fb.png';
import messageIcon from '../../imgs/message.png';

class User extends Component 
{
  constructor(props)
  {
    super(props);
    
    yawp.config(function (c) {
      c.baseUrl('https://new-spotted-cotuca.appspot.com/api');
    });
    
    this.selectSpots();
  }
  
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
    yawp('/spots/approvedd').list(l => this.setState({spots: l}));
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
          <a href={"https://www.facebook.com/pg/spottedcotuca3/posts/" + spot.postId} target="blank"><img alt="fb" className="socialMedia" src={ fbIcon }></img></a>
        </div>
      </div>
    );
  }

  render() 
  {
    return (
      <div className="App">
        <header className="App-header">
          {/*<img className="letter" src={ letterIcon } alt="letter"></img>*/}
          <a href="./"><h1 className="App-title">Spotted Cotuca</h1></a>
        </header>
        
        <div className="content">
          { this.printSpots() }
        </div>
        
        <a href="./send"><img alt="sendSpot" className="sendSpot" src={ messageIcon }/></a>
          
        <div className="App-footer">
          Feito com <i className="heart">♥</i> por <a className="fbLink" href="https://fb.com/igor.mandello" target="blank">Igor</a> e <a className="fbLink" href="https://fb.com/lorenzopincinato" target="blank">Lorenzo</a>
        </div>
      </div>
    );
  }
}

export default User;
