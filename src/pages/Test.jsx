import React from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import practiceTests from '../data/practice-tests.json';
import pastTests from '../data/past-tests.json'

import './generic_page.css';

export default class Grade extends React.Component {

  render() {
    return <div>
      <Helmet>
        <title>Take Tests</title>
      </Helmet>
      <h1>Take SAT Tests</h1>
      <p>If you want to take an SAT test online,
        these links will allow you to view a test digitally,
        record your answers, automatically grade individual questions and sections,
        view your score, 
        examine answer explanations, and
        review any skills you need to work on.
      </p>
      <p>If you've already completed a test and don't need to view it side-by-side, <Link to='/grade'>click this link instead</Link>.
      You can also switch views part way through, if you don't need to view the test anymore.</p>

      <h2>Official Practice</h2>
      <ul>
        {practiceTests.map((testName, i) => <li key={i}><Link to={`/${testName.toLowerCase().replaceAll(' ', '-')}/test`}>{testName}</Link></li>)}
      </ul>
      <h2>Past Exams</h2>
      <ul>
        {pastTests.map((testName, i) => <li key={i}><Link to={`/${testName.toLowerCase().replaceAll(' ', '-')}/test`}>{testName}</Link></li>)}
      </ul>
    </div>
  }

}