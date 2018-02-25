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
      c.baseUrl('https://new-spotted-cotuca.appspot.com/api');
    });
  }
  
  componentDidMount()
  {
    document.title = "Spotted Cotuca";
  }
  
  sendSpot()
  {
    let textArea = document.getElementById("message"),
        text = textArea.value;
    
    if (text == "")
      Alert.error(<h1>Se você não escrever nada, não tem como o crush te notar!</h1>, {
        position: 'bottom-right',
        effect: 'scale',
        timeout: 4000
      });
    else if (text.length > 280)
      Alert.error(<h1>Somos integrados com o Twitter, logo, não podemos aceitar spots com mais de 180 caracteres 😢</h1>, {
          position: 'bottom-right',
          effect: 'scale',
          timeout: 4000
      });
    else
      yawp('/spots').create({ message: textArea.value }).then(() => 
      { 
        textArea.value = "";
        if (text.toUpperCase().includes("NA PD"))
          this.createSuccessAlert("Sua mensagem foi enviada, agora manda seu crush pagar a PD também!");
        else if (text.toUpperCase().includes("NÃO ME QUER") || text.toUpperCase().includes("NÃO ME NOTA"))
          this.createSuccessAlert("Sua mensagem foi enviada, E É CLARO QUE SEU CRUSH TE QUER!");
        else
          this.createSuccessAlert("Sua mensagem foi enviada, agora é só esperar!");
      });  
  }
  
  createSuccessAlert(message)
  {
    Alert.success(<h1>{message}</h1>, {
      position: 'bottom-right',
      effect: 'scale',
      timeout: 4000
    });
  }

  render() 
  {
    return (
      <div className="App">
        <header className="App-header">
          <a href="./"><h1 className="App-title">Spotted Cotuca</h1></a>
        </header>
        
        <div className="content">
          <div className="middle">
            <div className="presentation">
              Olá! Esse é o novo método de mandar spots no COTUCA :). Basta mandar a mensagem no campo abaixo e esperar ser aprovada por um de nossos administradores, para que ela seja postada no nosso <a className="socialLink" href="https://fb.com/spottedcotuca3" target="blank">Facebook</a> e no nosso <a className="socialLink" href="https://twitter.com/spottedcotuca3" target="blank">Twitter</a>. Boa sorte com os crushes!
            </div>

            <textarea maxLength="280" placeholder="Digite sua mensagem..." id="message"></textarea>

            <br/>

            <button className="btn btn-primary" onClick={() => this.sendSpot()}>Enviar Spot</button>

            <Alert stack={{limit: 3}} />
          </div>
        </div>
        
        <footer className="App-footer">
          Feito com <i className="heart">♥</i> por <a className="fbLink" href="https://fb.com/igor.mandello" target="blank">Igor</a> e <a className="fbLink" href="https://fb.com/lorenzopincinato" target="blank">Lorenzo</a>
        </footer>
      </div>
    );
  }
}

export default User;
