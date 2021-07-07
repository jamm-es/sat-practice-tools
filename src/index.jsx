import React from 'react';
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
import {Grader} from './grader';

ReactDOM.render(
  <React.StrictMode>
    <Helmet
      titleTemplate='%s | look@num'
      defaultTitle='look@num'
    >
    </Helmet>
    <Header />
    <Router>
      <main>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/grade' component={Grader}/>
          <Route exact path='/notfound' component={NotFound} />
          <Route component={NotFound}/>
        </Switch>
      </main>

      <Footer />

    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);