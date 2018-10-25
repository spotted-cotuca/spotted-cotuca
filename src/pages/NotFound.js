import React, { Component } from 'react';

import '../css/NotFound.css';
import '../css/index.css';

import brokenHeartIcon from '../imgs/broken-heart.png';

class NotFound extends Component 
{
  render() 
  {
    return (
      <div className="content notFound">
        <img className="brokenHeart" src={ brokenHeartIcon } alt="Broken Heart"></img>
        <div className="message">
          <strong>Oh, não!</strong>
          <br/><br/>
          Parece que o crush não está nessa direção, aliás, <strong>NADA</strong> está nessa direção.
          <br/><br/>

          <a className="link" href="./#/">Voltar para a home.</a>
        </div>
      </div>
    );
  }
}

export default NotFound;
