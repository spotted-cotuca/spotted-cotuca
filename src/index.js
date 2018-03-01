import React from 'react';
import ReactDOM from 'react-dom';
import BurgerMenu from 'react-burger-menu';
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Home from './screens/Home/Home';
import Admin from './screens/Admin/Admin';
import User from './screens/User/User';
import NotFound from './screens/NotFound/NotFound';
import registerServiceWorker from './registerServiceWorker';

import fbIcon from './imgs/whiteFb.png';
import ttIcon from './imgs/whiteTt.png';

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
            <a href={ "https://www.facebook.com/spottedcotuca3" } target="blank"><img alt="fb" className="menuSocialMedia" src={ fbIcon }></img></a>
            <a href={ "https://twitter.com/spottedcotuca3" } target="blank"><img alt="tt" className="menuSocialMedia" src={ ttIcon }></img></a>
          </div>
        </Menu>
      </MenuWrap>
    );
  }

  render()
  {
    return (
      <div id="App" className='App'>
        <header className="App-header">
          { this.getMenu() }
          <a href="./#/"><h1 className="App-title">Spotted Cotuca</h1></a>
        </header>

        <Router>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/send" component={User}/>
            <Route path="/admin" component={Admin}/>
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
