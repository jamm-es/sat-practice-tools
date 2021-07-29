import React from 'react';
import {Link} from 'react-router-dom';

import practiceTests from '../data/practice-tests.json';
import pastTests from '../data/past-tests.json';

import './home.css';

export default class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      windowWidth: 0
    }
  }

  componentDidMount() {
    this.setWidth(); 
    window.addEventListener('resize', this.setWidth.bind(this)); 
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.setWidth.bind(this)); 
  }

  setWidth() {
    this.setState({ windowWidth: window.innerWidth });
  }

  generateQuestionGrid(urlFirstPart) {
    if(this.state.windowWidth > 600) {
      return <div className='home-test-container'>
        <h3 className='home-practice-col'>Official Practice</h3>
        <div className='home-grid-vertical-line'></div>
        <h3 className='home-past-col'>Past Exams</h3>
        <div className='home-grid-horizontal-line'></div>
        <div className='home-practice-entries'>
          <div>
            {
              practiceTests.map(d => <p><Link to={`/${urlFirstPart}/${d.toLowerCase().replaceAll(' ', '-')}`}>{d}</Link></p>)
            }
          </div>
        </div>
        <div className='home-grid-vertical-line'></div>
        <div className='home-past-entries'>
          <div>
            {
              pastTests.map(d => <p><Link to={`/${urlFirstPart}/${d.toLowerCase().replaceAll(' ', '-')}`}>{d}</Link></p>)
            }
          </div>
        </div>
      </div>
    }
    else {
      return <div className='home-test-container'>
        <h3 className='home-practice-col'>Official Practice</h3>
        <div className='home-grid-horizontal-line'></div>
        <div className='home-practice-entries'>
          <div>
            {
              practiceTests.map(d => <p><Link to={`/${urlFirstPart}/${d.toLowerCase().replaceAll(' ', '-')}`}>{d}</Link></p>)
            }
          </div>
        </div>
        <div className='home-grid-horizontal-line'></div>
        <h3 className='home-past-col'>Past Exams</h3>
        <div className='home-grid-horizontal-line'></div>
        <div className='home-past-entries'>
          <div>
            {
              pastTests.map(d => <p><Link to={`/${urlFirstPart}/${d.toLowerCase().replaceAll(' ', '-')}`}>{d}</Link></p>)
            }
          </div>
        </div>
      </div>
    }
  }

  render() {
    return (
      <div className='home'>
        <h2>Take a practice test completely online:</h2>
        {this.generateQuestionGrid('test')}
        <h2>Or, grade a test you've already completed:</h2>
        {this.generateQuestionGrid('grade')}
        <h2>Once you're done, quickly view answer explanations and determine which topics you need to work on.</h2>
      </div>
    );
  }

}

