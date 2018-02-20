import React, { Component } from 'react';
import Alert from 'react-s-alert';
import yawp from 'yawp';

import './User.css';
import '../../index.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

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
    
    if (textArea.value !== "")
      yawp('/spots').create({ message: textArea.value }).then(() => 
        { 
          textArea.value = "";
          Alert.success(<h1>Sua mensagem foi enviada, agora é só esperar!</h1>, {
              position: 'bottom-right',
              effect: 'scale',
              timeout: 6000
          });
        });
    else
      Alert.error(<h1>Se você não escrever nada, não tem como o crush te notar!</h1>, {
            position: 'bottom-right',
            effect: 'scale',
            timeout: 6000
        });
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
          <div className="presentation">
            Olá! Esse é o novo método de mandar spots no COTUCA :). Basta mandar a mensagem no campo abaixo e esperar ser aprovada por um de nossos administradores, para que ela seja postada no nosso Facebook oficial (nome da página) e no nosso twitter (@dospotted). Boa sorte com os crushes!
          </div>
          
          <textarea maxLength="280" placeholder="Digite sua mensagem..." id="message"></textarea>
          
          <br/>
          
          <button className="btn btn-primary" onClick={() => this.sendSpot()}>Enviar Spot</button>
          
          <Alert stack={{limit: 3}} />
        </div>
      </div>
    );
  }
}

export default User;
