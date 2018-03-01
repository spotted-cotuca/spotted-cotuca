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
      c.baseUrl('https://newspottedctc.appspot.com/api');
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
    
    if (text === "")
      this.createErrorMessage("Se você não escrever nada, não tem como o crush te notar!");
    else if (text.length > 280)
      this.createErrorMessage("Somos integrados com o Twitter, logo, não podemos aceitar spots com mais de 280 caracteres <span>😢</span>");
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
      }).catch(err => this.createErrorMessage("Algo de errado ocorreu ao tentar enviar o spot, por favor, tente novamente e verifique sua conexão"));
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
      <div className="content">
        <div className="middle">
          <div className="presentation">
          Olá, esse é o novo Spotted Cotuca 😁. Basta mandar a mensagem no campo abaixo e esperar a aprovação de nossos administradores para que ela seja postada no <a className="socialLink" href="https://fb.com/spottedcotuca3" target="blank">Facebook</a> e <a className="socialLink" href="https://twitter.com/spottedcotuca3" target="blank">Twitter</a>. Boa sorte com os @s! 😉
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
