import React, { Component } from 'react';

import './NotFound.css';
import '../../index.css';

import letterIcon from '../../imgs/letter.png';
import brokenHeartIcon from '../../imgs/broken-heart.png';

class NotFound extends Component 
{

  componentDidMount()
  {
    document.title = "Spotted Cotuca";
  }

  render() 
  {
    return (
      <div className="App">
        <header className="App-header">
          <img className="letter" src={ letterIcon } alt="letter"></img>
          <h1 className="App-title">Spotted Cotuca</h1>
        </header>
        
        <div className="content">
          <img className="brokenHeart" src={ brokenHeartIcon } alt="Broken Heart"></img>
          <div className="message">
            <strong>Oh, não!</strong>
            <br/><br/>
            Parece que o crush não está nessa direção, aliás, <strong>NADA</strong> está nessa direção.
            <br/><br/>
            <a className="link" href="../">Voltar para a home.</a>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
