import React from 'react';
import ReactDOM from 'react-dom';
import BurgerMenu from 'react-burger-menu';
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

import './css/index.css';

const config = require('./config.json');

class MenuWrap extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.state = 
    {
      hidden: false
    };
  }

  show()
  {
    this.setState({hidden : false});
  }

  render()
  {
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

class Main extends React.Component
{
  getMenu()
  {
    const Menu = BurgerMenu['slide'];
    return (
      <MenuWrap wait={ 20 }>
        <Menu id={'slide'}>
          <a href="./#/admin">
            <div className="bm-item-wrap">
              Admin
            </div>
          </a>
          
          <a href="./#/send">
            <div className="bm-item-wrap">
              Enviar spots
            </div>
          </a>
          
          <div className="bm-item-wrap">
            <a href={ "https://www.facebook.com/spottedcotuca3" } target="blank"><i className="fa fa-facebook"/></a>
            <a href={ "https://twitter.com/spottedcotuca3" } target="blank"><i className="fa fa-twitter"/></a>
          </div>
        </Menu>
      </MenuWrap>
    );
  }

  render()
  {
    console.log(config)
    return (
      <div id="App" className='App'>
        <header className="App-header">
          { this.getMenu() }
          <a href="./#/"><h1 className="App-title">Spotted Cotuca</h1></a>
        </header>

        <Router>
          <Switch>
            <Route exact path="/" render={(props) => <Home {...props} serverUrl={config.serverUrl} />}/>
            <Route path="/send" render={(props) => <User {...props} serverUrl={config.serverUrl} />}/>
            <Route path="/admin" render={(props) => <Admin {...props} serverUrl={config.serverUrl} proxyUrl={config.proxyUrl} firebase={config.firebase} />}/>
            <Route path="/api" component={null}/>
            <Route path="*" component={NotFound}/>
          </Switch>
        </Router>
      
        <div className="App-footer">
          Feito com <i className="heart">♥</i> por <a className="fbLink" href="https://fb.com/igor.mandello" target="blank">Igor</a> e <a className="fbLink" href="https://fb.com/lorenzopincinato" target="blank">Lorenzo</a>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
registerServiceWorker();
