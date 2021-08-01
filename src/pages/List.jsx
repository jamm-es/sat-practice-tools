import React from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

import practiceTests from '../data/practice-tests.json';
import pastTests from '../data/past-tests.json'

import './generic_page.css';

export default class ListEntry extends React.Component {

  render() {
    return <div>
      <Helmet>
        <title>All Practice Tests</title>
      </Helmet>
      <h1>List of All Tests</h1>
      <p>This is a list of every test available to take on this website. After clicking a test, you will have the option to either take or grade the test.</p>
      
      <h2>Official Practice</h2>
      <ul>
        {practiceTests.map((testName, i) => <li key={i}><Link to={`/${testName.toLowerCase().replaceAll(' ', '-')}`}>{testName}</Link></li>)}
      </ul>
      <h2>Past Exams</h2>
      <ul>
        {pastTests.map((testName, i) => <li key={i}><Link to={`/${testName.toLowerCase().replaceAll(' ', '-')}`}>{testName}</Link></li>)}
      </ul>
    </div>
  }

}