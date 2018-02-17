import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Admin from './screens/Admin/Admin';
import User from './screens/User/User';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<User/>, document.getElementById('root'));
registerServiceWorker();
