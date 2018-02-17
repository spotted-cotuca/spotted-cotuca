import React, { Component } from 'react';
import yawp from 'yawp';
import './App.css';


class App extends Component 
{
  constructor(props)
  {
    super(props);
  };

  state =
  {
    spots: []  
  }
  
  printSpots()
  {
    let spotsDivs =[];
    return spotsDivs;
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

export default App;
