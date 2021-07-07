import React from 'react';
import {default as Section} from './Section';

export default class Home extends React.Component {

  render() {
    return (
      <div>
        <h1>SAT Practice Tools</h1>
        <Section testNum={1} section={'math_no_calc'} />
      </div>
    );
  }

}

