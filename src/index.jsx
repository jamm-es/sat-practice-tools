import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import './index.css';

import {Footer, Header, NotFound} from './main';
import {Home, Test, Grade, About} from './pages';
import {TestView} from './test-view';

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
        <Route path='/test/:test' render={props =>  <TestView test={props.match.params.test} isTestMode />} />
        <Route path='/grade/:test' render={props => <TestView test={props.match.params.test} />} />
        <Route> {/* encompasses everything that needs to be nested inside main */}
          <main>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/test' component={Test} />
              <Route exact path='/grade' component={Grade} />
              <Route exact path='/about' component={About} />
              <Route exact path='/notfound' component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </Route>
      </Switch>
      <Switch>
        <Route path='/test/*'/>
        <Route component={Footer}/>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);