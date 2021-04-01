import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/postagens/page=:page" component={App} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
