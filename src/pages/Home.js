import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchApprovedSpots, deleteSpot } from '../actions/spotActions';

import SpotBox from '../components/SpotBox';
import Spinner from '../components/Spinner';

import messageIcon from '../imgs/message.png';
import brokenHeartIcon from '../imgs/broken-heart.png';

import '../css/Home.css';

class Home extends Component {
  componentDidMount() {
    this.props.fetchApprovedSpots();
  }

  renderSpots(spots) {
    if (!spots) return
    
    return spots.map(spot => 
      <SpotBox
        posted
        deleteSpot={() => this.props.deleteSpot(spot.createdAt, spot.id)}
        key={spot.id}
        {...spot}
        date={new Date(spot.createdAt)}
      />
    )
  }

  render() {
    const error = !this.props.spots.approvedSpots && !this.props.spots.fetchingApproved
    return (
      <div id="content" className="content home">
        { this.props.spots.fetchingApproved && <Spinner /> }
        
        { 
          error && 
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
        
        { this.renderSpots(this.props.spots.approvedSpots) }

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
  state => ({ token: state.authentication.token, spots: state.spots }),
  { fetchApprovedSpots, deleteSpot }
)(Home);
