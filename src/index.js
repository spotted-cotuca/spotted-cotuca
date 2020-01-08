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

import Home from './pages/Home';
import Admin from './pages/Admin';
import User from './pages/User';
import NotFound from './pages/NotFound';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { verifyAuthState } from './actions/authenticationActions';

import logo from './imgs/logo.png';
import './css/index.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    if (window.location.host.startsWith('www.'))
      window.location.host = window.location.host.replace('www.', '');
  }

  getMenu() {
    let closeMenu = () => this.refs.menu.toggleMenu()
    const Menu = BurgerMenu['slide'];
    return (
      <Menu id={'slide'} ref="menu">
        <div>
          <a onClick={closeMenu} href="./#/admin">Administração</a>
        </div>
        <div>
          <a onClick={closeMenu} href="./#/send">Enviar spots</a>
        </div>
        <div>
          <a href={ "https://www.facebook.com/spottedcotuca3" } target="blank"><i className="fa fa-facebook"/></a>
          <a href={ "https://twitter.com/spottedcotuca3" } target="blank"><i className="fa fa-twitter"/></a>
        </div>
      </Menu>
    );
  }

  componentDidMount() {
    store.dispatch(verifyAuthState());
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
              <Route exact path="/" component={Home} />
              <Route path="/send" component={User} />
              <Route path="/admin" component={Admin} />
              <Route path="/api" component={null} />
              <Route path="*" component={NotFound} />
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
