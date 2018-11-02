import React, { Component } from 'react';
import yawp from 'yawp';
import SpotBox from '../components/SpotBox';
import Spinner from '../components/Spinner';

import messageIcon from '../imgs/message.png';
import brokenHeartIcon from '../imgs/broken-heart.png';

import '../css/Home.css';

class Home extends Component 
{
  constructor(props) {
    super(props);

    yawp.config(c => c.baseUrl(props.serverUrl));
    this.state = {
      spots: [],
      loaded: false,
      error: false,
    }
  }

  componentDidMount() {
    yawp('/spots/approved').list(l => 
      this.setState({
        spots: l.map(spot => <SpotBox key={spot.id} {...spot} date={new Date(spot.date)}/>),
        loaded: true
      })
    ).catch(e => 
      this.setState({
        loaded: true,
        error: true
      })
    );
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
                  Algo deu errado ao tentar pegar os spots, por favor, <a className="link" href="./">recarregue a página</a>.
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

export default Home;
