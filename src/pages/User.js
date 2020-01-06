import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';

import Spinner from '../components/Spinner';

import 'react-notifications/lib/notifications.css';
import '../css/User.css';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSend: true
    }
  }

  sendSpot = () => {
    if (!this.state.canSend) {
      this.createErrorMessage('Espera mais um pouquinho, o crush não vai fugir não!');
      return;
    }

    let textArea = document.getElementById("message"),
        text = textArea.value.trim();

    let betweenQuotes = text.match(/^["“'](.|\n)*["”']$/);
    let removeQuotes = betweenQuotes && text.match(/["“”']/g).length <= 2;
    if (removeQuotes)
      text = text.substring(1, text.length - 1);

    text = text.trim();
    
    if (text === '')
      this.createErrorMessage('Se você não escrever nada, não tem como o crush te notar!');
    else if (text.length > 278)
      this.createErrorMessage('Somos integrados com o Twitter, logo, não podemos aceitar spots com mais de 280 caracteres 😢');
    else {
      this.setState({
        canSend: false
      });

      fetch(`${this.props.serverUrl}/v1/spots`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ message: text })
      }).then(() => {
        textArea.value = '';
        let testText = text.toUpperCase();
        if (removeQuotes) {
          this.createSuccessAlert('Pode deixar que nós já colocamos as aspas para você, elas foram removidas e sua mensagem enviada 😊');
        } else if (testText.includes('NA PD')) {
          this.createSuccessAlert('Sua mensagem foi enviada, agora manda seu crush pagar a PD também!');
        } else if (testText.includes('NÃO ME QUER') || testText.includes('NÃO ME NOTA')) {
          this.createSuccessAlert('Sua mensagem foi enviada, E É CLARO QUE SEU CRUSH TE QUER!');
        } else {
          this.createSuccessAlert('Sua mensagem foi enviada, agora é só esperar!');
        }

        this.setState({ canSend: true });
      }).catch(() => {
        this.createErrorMessage('Algo de errado ocorreu ao tentar enviar o spot, por favor, tente novamente e verifique sua conexão');
        this.setState({ canSend: true });
      });
    }
  }

  createErrorMessage(message) {
    NotificationManager.error(message, 'Ah não...', 4000);
  }

  createSuccessAlert(message) {
    NotificationManager.success(message, 'Aí sim!', 4000);
  }

  render() {
    return (
      <div className="content user">
        <div className="presentation">
          Olá, esse é o Spotted Cotuca <span role="img" aria-label="smile face">😁</span>.
          Basta mandar a mensagem no campo abaixo e esperar a aprovação de nossos administradores 
          para que ela seja postada no <a className="socialLink" href="https://fb.com/spottedcotuca3" target="blank">
            Facebook
          </a> e <a className="socialLink" href="https://twitter.com/spottedcotuca3" target="blank">
            Twitter
          </a>. 
          Boa sorte com os @s! <span role="img" aria-label="blinky face">😉</span>
        </div>
        <textarea maxLength="278" placeholder="Digite sua mensagem..." id="message"></textarea>

        <button className="btn" onClick={this.sendSpot}>
          Enviar Spot
          <Spinner active={!this.state.canSend} color="#FFF"/>
        </button>
      </div>
    );
  }
}

export default User;
