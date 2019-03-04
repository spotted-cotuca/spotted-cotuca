import React, { Component } from 'react';
import yawp from 'yawp';
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

    yawp.config(c => c.baseUrl(props.serverUrl));
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
    yawp('/spots/approved').list(l => 
      this.setState({
        spots: l.map(
          spot => 
            <SpotBox
              posted
              deleteSpot={
                () => this.deleteSpot(spot.id, spot.fbPostId, spot.ttPostId)
              }
              key={spot.id}
              {...spot}
              date={new Date(spot.date)}
            />
        ),
        loaded: true
      })
    ).catch(e => 
      this.setState({
        loaded: true,
        error: true
      })
    );
  }

  async deleteSpot(id, fbId, ttId) {
    let deleted = await this.props.socialMediasHandler.deleteFromSocialMedias(fbId, ttId);
    if (deleted.facebook && deleted.twitter) {
      NotificationManager.success('Spot deletado com sucesso.', 'Aí sim!', 2000);
      
      fetch(this.props.serverUrl + id, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: 'Bearer ' + this.props.token
        })
      }).then(() => this.selectSpots());
    }
    else if (!(deleted.twitter || deleted.facebook))
      NotificationManager.error('Algo de errado aconteceu, o spot não foi deletado de nenhum lugar', 'Ah não...', 2000);
    else
      NotificationManager.error('Algo de errado aconteceu, mas o spot foi deletado do ' + (deleted.facebook ? 'Facebook.' : 'Twitter.'), 'Ah não...', 2000);
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

export default connect(
  state => ({ 
    token: state.authentication.token,
    socialMediasHandler: state.authentication.socialMediasHandler 
  }),
  {}
)(Home);
