import React, { Component } from 'react';
import yawp from 'yawp';

import '../../index.css';
import '../../sass/Home.css';

import fbIcon from '../../imgs/fb.png';
import ttIcon from '../../imgs/tt.png';
import messageIcon from '../../imgs/message.png';
import brokenHeartIcon from '../../imgs/broken-heart.png';

class Home extends Component 
{
  constructor(props)
  {
    super(props);
    
    yawp.config(function (c) {
      c.baseUrl(props.serverUrl);
    });
    
    this.selectSpots();
  }
  
  state =
  {
    spots: [],
    loaded: false,
    error: false,
  }

  selectSpots()
  {
    yawp('/spots/approved').list(l => this.setState({spots: l, loaded: true})).catch(e => this.setState({loaded: true, error: true}));
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
    var serverDate = new Date(spot.date);
    var date = new Date(serverDate);
    date.setMinutes(serverDate.getMinutes() - serverDate.getTimezoneOffset());
    
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
          <a href={ "https://www.facebook.com/pg/spottedcotuca3/posts/" + spot.fbPostId } target="blank"><img alt="fb" className="socialMedia" src={ fbIcon }></img></a>
          <a href={ "https://twitter.com/spottedcotuca3/status/" + spot.ttPostId } target="blank"><img alt="tt" className="socialMedia" src={ ttIcon }></img></a>
        </div>
      </div>
    );
  }

  render() 
  {
    return (
        <div id="content" className="content">
          { !this.state.loaded && <div className="loader"></div> }
          
          { 
            this.state.error && 
            <div className="error">
              <img className="brokenHeart" src={ brokenHeartIcon } alt="Broken Heart"></img>
              <div className="message">
                <strong>Oh, não!</strong>
                <br/><br/>
                Algo deu errado ao tentar pegar os spots, por favor, <a className="link" href="./">recarregue a página</a>.
                <br/><br/>
              </div>
            </div> 
          }
          
          { this.printSpots() }
          
          <a href="./#/send"><img alt="sendSpot" className="sendSpot" src={ messageIcon }/></a>
        </div>
    );
  }
}

export default Home;
