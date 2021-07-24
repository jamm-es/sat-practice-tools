import React from 'react';
import PropTypes from 'prop-types';

import {Grade} from '../grade';

import practiceTests from '../data/practice-tests.json';

import './grade-view.css';

export default class GradeView extends React.Component {

  constructor(props) {
    super(props);
  }

  // from https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  render() {
    return <div className='grade-view'>
      <h1>Test: {this.toTitleCase(this.props.test.replaceAll('-', ' '))}</h1>
      <Grade 
        test={this.props.test}
        thirdPartyMode={!practiceTests.some(d => d.replaceAll(' ', '-').toLowerCase() === this.props.test)}
      />
    </div>
  }

}

GradeView.propTypes = {
  test: PropTypes.string
}