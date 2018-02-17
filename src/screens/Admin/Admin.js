import React, { Component } from 'react';
import yawp from 'yawp';
import './Admin.css';

import approveIcon from '../../imgs/approve.png';
import rejectIcon from '../../imgs/reject.png';

class Admin extends Component 
{
  constructor(props)
  {
    super(props);
    
    yawp.config(function (c) {
      c.baseUrl('http://new-spotted-cotuca.appspot.com/api');
    });
    
    this.selectSpots()
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

  render() 
  {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Spotted Cotuca</h1>
        </header>
        
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
