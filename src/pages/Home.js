import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import SpotBox from '../components/SpotBox';
import Spinner from '../components/Spinner';

import messageIcon from '../imgs/message.png';
import brokenHeartIcon from '../imgs/broken-heart.png';

import '../css/Home.css';

class Home extends Component 
{
  constructor(props) {
    super(props);

    this.state = {
      spots: [],
      loaded: false,
      error: false,
    }
  }

  componentDidMount() {
    this.selectSpots();
  }

  selectSpots() {
    fetch(`${this.props.serverUrl}/v1/spots/approved`)
      .then(res => res.json())
      .then(res => {
        this.setState({
          spots: res.map(spot => 
            <SpotBox
              posted
              deleteSpot={ () => this.deleteSpot(spot.createdAt.split('T')[0], spot.id) }
              key={spot.id}
              {...spot}
              date={new Date(spot.createdAt)}
            />
          ),
          loaded: true
        })
      })
      .catch(() => 
        this.setState({
          loaded: true,
          error: true
        })
      );
  }

  async deleteSpot(date, id) {
    const response = await fetch(`${this.props.serverUrl}/v1/spots/${date}/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      })
    });

    if (!response.ok) {
      NotificationManager.error('Algo de errado aconteceu', 'Ah não...', 2000);
      return;
    }

    NotificationManager.success('Spot deletado com sucesso.', 'Aí sim!', 2000);
    this.selectSpots();
  }

  render() {
    return (
      <div id="content" className="content home">
        { !this.state.loaded && <Spinner /> }
        
        { 
          this.state.error && 
          <div className="error">
            <img className="brokenHeart" src={ brokenHeartIcon } alt="Broken Heart"></img>
            <div className="message">
              <strong>Oh, não!</strong>
              <br/><br/>
                Algo deu errado ao tentar pegar os spots, por favor, <a href="./">recarregue a página</a>.
              <br/><br/>
            </div>
          </div> 
        }
        
        { this.state.spots }

        <a href="./#/send" className="sendSpot">
          <div className="send">
            <div className="letter">
              Enviar
              <img src={messageIcon} alt=""/>
              Spots
            </div>
            <div className="thumb"/>
          </div>
        </a>
      </div>
    );
  }
}

export default connect(state => ({ token: state.authentication.token }), {})(Home);
