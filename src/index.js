import React from 'react';
import ReactDOM from 'react-dom';
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

class Main extends React.Component
{
  render()
  {
    return (
      <div id="App" className='App'>
        <header className="App-header">
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
