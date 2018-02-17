import React, { Component } from 'react';
import yawp from 'yawp';
import './User.css';

import approveIcon from '../../imgs/approve.png';
import rejectIcon from '../../imgs/reject.png';

class User extends Component 
{
  constructor(props)
  {
    super(props);
    
    yawp.config(function (c) {
      c.baseUrl('http://new-spotted-cotuca.appspot.com/api');
    });
  }
  
  componentDidMount()
  {
    document.title = "Spotted Cotuca";
  }
  
  sendSpot()
  {
    let textArea = document.getElementById("message");
    yawp('/spots').create({ message: textArea.value }).then(() => textArea.value = "");
  }

  render() 
  {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Spotted Cotuca</h1>
        </header>
        
        <div className="content">
          <div className="presentation">
            Olá! Esse é o novo método de mandar spots no COTUCA :). Basta mandar a mensagem no campo abaixo e esperar ser aprovada por um de nossos administradores, para que ela seja postada no nosso Facebook oficial (nome da página) e no nosso twitter (@dospotted). Boa sorte com os crushes!
          </div>
          
          <textarea maxLength="280" id="message"></textarea>
          
          <br/>
          
          <button className="btn btn-primary" onClick={() => this.sendSpot()}>Enviar Spot</button>
        </div>
      </div>
    );
  }
}

export default User;
