import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import {Footer, Header, NotFound} from './main';
import {Home, Test, Grade, About, List, ListEntry} from './pages';
import {TestView} from './test-view';

import practiceTests from './data/practice-tests.json';
import pastTests from './data/past-tests.json'

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Helmet
      titleTemplate='%s | SAT Practice Tools'
      defaultTitle='SAT Practice Tools'
    >
      <meta
        name="description"
        content="Easily take and grade free, official SAT practice tests and past exams online. Measure your skills and view explanations of questions you're confused about."
      />
    </Helmet>
    <Header />
    <Router>
      <Switch>
        <Route path='/:test/test' exact render={props =>  <TestView test={props.match.params.test} isTestMode />} />
        <Route path='/:test/grade' exact render={props => <TestView test={props.match.params.test} />} />
        <Route> {/* encompasses everything that needs to be nested inside main */}
          <main>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/test' component={Test} />
              <Route exact path='/grade' component={Grade} />
              <Route exact path='/about' component={About} />
              <Route exact path='/list' component={List} />
              {practiceTests.map(testName => testName.toLowerCase().replaceAll(' ', '-')).map(testName => <Route path={`/${testName}`} exact render={() => <ListEntry test={testName} />} />)}
              {pastTests.map(testName => testName.toLowerCase().replaceAll(' ', '-')).map(testName => <Route path={`/${testName}`} exact render={() => <ListEntry test={testName} />} />)}
              <Route exact path='/notfound' component={NotFound} status={404} />
              <Route component={NotFound} status={404} />
            </Switch>
          </main>
        </Route>
      </Switch>
      <Switch>
        <Route path='/*/test'/>
        <Route component={Footer}/>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);