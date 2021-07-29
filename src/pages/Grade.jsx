import React from 'react';
import {Link} from 'react-router-dom';

import practiceTests from '../data/practice-tests.json';
import pastTests from '../data/past-tests.json'

import './generic_page.css';

export default class Grade extends React.Component {

  render() {
    return <div>
      <h1>Grade SAT Tests</h1>
      <p>If you've already completed an SAT test on paper, 
        these links will allow you to quickly enter in your answers, 
        view your score, 
        examine answer explanations, and
        review any skills you need to work on.</p>
      <p>If you need to view the test side-by-side, <Link to='/test'>click this link instead</Link>.
      You can also switch to having the test alongside your answers part way through.</p>

      <h2>Official Practice</h2>
      <ul>
        {practiceTests.map((testName, i) => <li key={i}><Link to={`/grade/${testName.toLowerCase().replaceAll(' ', '-')}`}>{testName}</Link></li>)}
      </ul>
      <h2>Past Exams</h2>
      <ul>
        {pastTests.map((testName, i) => <li key={i}><Link to={`/grade/${testName.toLowerCase().replaceAll(' ', '-')}`}>{testName}</Link></li>)}
      </ul>
    </div>
  }

}