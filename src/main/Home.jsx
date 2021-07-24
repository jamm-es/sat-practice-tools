import React from 'react';
import {Link} from 'react-router-dom';

import practiceTests from '../data/practice-tests.json';
import pastTests from '../data/past-tests.json';

import './home.css';

export default class Home extends React.Component {

  render() {
    return (
      <div>
        <h2>Take a practice test completely online:</h2>
        <div className='home-test-container'>
          <h3 className='home-practice-col'>Official Practice</h3>
          <div className='home-grid-vertical-line'></div>
          <h3 className='home-past-col'>Past Exams</h3>
          <div className='home-grid-horizontal-line'></div>
          <div className='home-practice-entries'>
            <div>
              {
                practiceTests.map(d => <p><Link to={`/test/${d.toLowerCase().replaceAll(' ', '-')}`}>{d}</Link></p>)
              }
            </div>
          </div>
          <div className='home-grid-vertical-line'></div>
          <div className='home-past-entries'>
            <div>
              {
                pastTests.map(d => <p><Link to={`/test/${d.toLowerCase().replaceAll(' ', '-')}`}>{d}</Link></p>)
              }
            </div>
          </div>
        </div>
        <h2>Or, grade a test you've already completed:</h2>
        <div className='home-test-container'>
          <h3 className='home-practice-col'>Official Practice</h3>
          <div className='home-grid-vertical-line'></div>
          <h3 className='home-past-col'>Past Exams</h3>
          <div className='home-grid-horizontal-line'></div>
          <div className='home-practice-entries'>
            <div>
              {
                practiceTests.map(d => <p><Link to={`/grade/${d.toLowerCase().replaceAll(' ', '-')}`}>{d}</Link></p>)
              }
            </div>
          </div>
          <div className='home-grid-vertical-line'></div>
          <div className='home-past-entries'>
            <div>
              {
                pastTests.map(d => <p><Link to={`/grade/${d.toLowerCase().replaceAll(' ', '-')}`}>{d}</Link></p>)
              }
            </div>
          </div>
        </div>

        <h2>Once you're done, quickly view answer explanations and determine which topics you need to work on.</h2>
      </div>
    );
  }

}

