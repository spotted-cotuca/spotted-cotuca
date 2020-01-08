import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendSpot } from '../actions/spotActions';
import { NotificationManager } from 'react-notifications';

import Spinner from '../components/Spinner';

import 'react-notifications/lib/notifications.css';
import '../css/User.css';

class User extends Component {
  sendSpot = () => {
    if (!this.props.canSend) {
      return NotificationManager.error('Espera mais um pouquinho, o crush não vai fugir não!', 'Ah não...', 4000);
    }

    this.props.sendSpot(document.getElementById("message"));
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
          <Spinner active={!this.props.canSend} color="#FFF"/>
        </button>
      </div>
    );
  }
}

export default connect(state => ({ canSend: state.spots.userCanSendSpot }), { sendSpot })(User);
