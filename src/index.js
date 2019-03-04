import React from 'react';
import ReactDOM from 'react-dom';
import BurgerMenu from 'react-burger-menu';
import { Provider } from 'react-redux';
import { NotificationContainer } from 'react-notifications';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import * as firebase from 'firebase';

import Home from './pages/Home';
import Admin from './pages/Admin';
import User from './pages/User';
import NotFound from './pages/NotFound';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { changeAuthState } from './actions/authenticationActions';

import logo from './imgs/logo.png';
import './css/index.css';

const config = require('./config.json');

class MenuWrap extends React.Component {
  constructor(props)
  {
    super(props);
    
    this.state = {
      hidden: false
    };
  }

  show() {
    this.setState({hidden : false});
  }

  render() {
    let style;
    if (this.state.hidden)
      style = { display: 'none' };

    return (
      <div style={style} className={this.props.side}>
        {this.props.children}
      </div>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    if (window.location.host.startsWith('www.'))
      window.location.host = window.location.host.replace('www.', '');
  }

  getMenu() {
    const Menu = BurgerMenu['slide'];
    return (
      <MenuWrap wait={ 20 }>
        <Menu id={'slide'}>
          <div>
            <a href="./#/admin">
              Administração
            </a>
          </div>
          <div>
            <a href="./#/send">
              Enviar spots
            </a>
          </div>
          <div>
            <a href={ "https://www.facebook.com/spottedcotuca3" } target="blank"><i className="fa fa-facebook"/></a>
            <a href={ "https://twitter.com/spottedcotuca3" } target="blank"><i className="fa fa-twitter"/></a>
          </div>
        </Menu>
      </MenuWrap>
    );
  }

  componentDidMount() {
    if (!firebase.apps.length)
      firebase.initializeApp(config.firebase);

    firebase.auth().onAuthStateChanged(user => {
      store.dispatch(changeAuthState(user));
    });
  }

  render() {
    return (
      <Provider store={store}>
        <div id="App" className='app'>
          <header>
            { this.getMenu() }
            <a href="./#/">
              <img src={logo} alt="logo"/>
            </a>
          </header>

          <div className="background" />
          <Router>
            <Switch>
              <Route exact path="/" render={(props) => <Home {...props} serverUrl={config.serverUrl} />}/>
              <Route path="/send" render={(props) => <User {...props} serverUrl={config.serverUrl} />}/>
              <Route path="/admin" render={(props) => <Admin {...props} serverUrl={config.serverUrl} />}/>
              <Route path="/api" component={null}/>
              <Route path="*" component={NotFound}/>
            </Switch>
          </Router>
        
          <NotificationContainer />

          <footer>
            Feito com <i className="heart">♥</i> por <a href="https://fb.com/igor.mandello" target="blank">Igor</a> e <a href="https://fb.com/lorenzopincinato" target="blank">Lorenzo</a> 
            <br/>
            Agradecimentos para <a href="https://fb.com/vitor.bartier" target="blank">Bart</a>
          </footer>
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
registerServiceWorker();
