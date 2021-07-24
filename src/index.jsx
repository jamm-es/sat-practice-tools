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
import {GradeView} from './grade-view';

ReactDOM.render(
  <React.StrictMode>
    <Helmet
      titleTemplate='%s | SAT Practice Tools'
      defaultTitle='SAT Practice Tools'
    >
    </Helmet>
    <Header />
    <Router>
      <Switch>
        <Route path='/test/:test' render={props => <TestView test={props.match.params.test}/>} />
        <Route> {/* encompasses everything that needs to be nested inside main */}
          <main>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/grade/:test' render={props => <GradeView test={props.match.params.test}/>} />
              <Route exact path='/notfound' component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </Route>
      </Switch>
      <Switch>
        <Route path='/test'/>
        <Route component={Footer}/>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);