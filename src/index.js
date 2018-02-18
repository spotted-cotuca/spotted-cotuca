import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';

import Admin from './screens/Admin/Admin';
import User from './screens/User/User';
import NotFound from './screens/NotFound/NotFound';
import registerServiceWorker from './registerServiceWorker';

import './index.css';

class Main extends React.Component
{
  render()
  {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={User}/>
          <Route path="/admin" component={Admin}/>
          <Route component={NotFound}/>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
registerServiceWorker();
