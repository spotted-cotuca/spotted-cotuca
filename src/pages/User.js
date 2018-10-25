import React, { Component } from 'react';
import Alert from 'react-s-alert';
import yawp from 'yawp';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';
import '../css/User.css';

class User extends Component 
{
  constructor(props)
  {
    super(props);
    
    
    this.canSend = true;
    yawp.config(function (c) {
      c.baseUrl(props.serverUrl);
    });
  }
  
  sendSpot()
  {
    if (!this.canSend)
    {
      this.createErrorMessage("Espera mais um pouquinho, o crush não vai fugir não");
      return;
    } 
    
    let textArea = document.getElementById("message"),
        text = textArea.value;
    
    if (text === "")
      this.createErrorMessage("Se você não escrever nada, não tem como o crush te notar!");
    else if (text.length > 278)
      this.createErrorMessage("Somos integrados com o Twitter, logo, não podemos aceitar spots com mais de 280 caracteres 😢");
    else
    {
      this.canSend = false;
      
      yawp('/spots').create({ message: textArea.value }).then(() => 
      { 
        textArea.value = "";
        if (text.toUpperCase().includes("NA PD"))
          this.createSuccessAlert("Sua mensagem foi enviada, agora manda seu crush pagar a PD também!");
        else if (text.toUpperCase().includes("NÃO ME QUER") || text.toUpperCase().includes("NÃO ME NOTA"))
          this.createSuccessAlert("Sua mensagem foi enviada, E É CLARO QUE SEU CRUSH TE QUER!");
        else
          this.createSuccessAlert("Sua mensagem foi enviada, agora é só esperar!");
        
        this.canSend = true;
      }).catch(err =>
      { 
        this.createErrorMessage("Algo de errado ocorreu ao tentar enviar o spot, por favor, tente novamente e verifique sua conexão");
        this.canSend = true;
      });
    }
  }
  
  createErrorMessage(message)
  {
    Alert.error(<h1>{message}</h1>, {
      position: 'bottom-right',
      effect: 'scale',
      timeout: 4000
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
      <div className="content user">
        <div className="middle">
          <div className="presentation">
            Olá, esse é o novo Spotted Cotuca <span role="img" aria-label="smile face">😁</span>. Basta mandar a mensagem no campo abaixo e esperar a aprovação de nossos administradores para que ela seja postada no <a className="socialLink" href="https://fb.com/spottedcotuca3" target="blank">Facebook</a> e <a className="socialLink" href="https://twitter.com/spottedcotuca3" target="blank">Twitter</a>. Boa sorte com os @s! <span role="img" aria-label="blinky face">😉</span>
          </div>

          <textarea maxLength="278" placeholder="Digite sua mensagem..." id="message"></textarea>

          <br/>

          <button className="btn btn-primary" onClick={() => this.sendSpot()}>Enviar Spot</button>

          <Alert stack={{limit: 3}} />
        </div>
      </div>
    );
  }
}

export default User;
