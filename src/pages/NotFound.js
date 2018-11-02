import React from 'react';
import brokenHeartIcon from '../imgs/broken-heart.png';

import '../css/NotFound.css';

function NotFound() {
  return (
    <div className="content notFound">
      <img className="brokenHeart" src={brokenHeartIcon} alt="Broken Heart"></img>
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

export default NotFound;
