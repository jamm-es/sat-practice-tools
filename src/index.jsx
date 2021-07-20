import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import './index.css';

import {Home, Footer, Header, NotFound} from './main';
import {Grade} from './grade';
import {TestView} from './test-view';

ReactDOM.render(
  <React.StrictMode>
    <Helmet
      titleTemplate='%s | look@num'
      defaultTitle='look@num'
    >
    </Helmet>
    <Header />
    <Router>
      <Switch>
        <Route path='/test'>
          <TestView test='5' />
        </Route>
        <Route> {/* encompasses everything that needs to be nested inside main */}
          <main>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/grade'>
                <Grade test='5' />
              </Route>
              <Route exact path='/notfound' component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </Route>
      </Switch>
      <Route path='/:^test' component={Footer}/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);