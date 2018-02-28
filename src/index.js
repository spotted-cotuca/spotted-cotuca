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
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/send" component={User}/>
          <Route path="/admin" component={Admin}/>
          <Route path="/api" component={null}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
registerServiceWorker();
