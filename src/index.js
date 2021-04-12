import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import App from './App';
import Login from "./Login";
import DarkMode from "./DarkMode";
import ScrollInfinito from "./ScrollInfinito";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/dark-mode" component={DarkMode} />
        <Route path="/scroll-infinito" component={ScrollInfinito} />
        <Route path="/postagens/page=:page" component={App} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
