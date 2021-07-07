import React from 'react';
import {csv} from 'd3';

import {default as Question} from './Question';

import './section.css';

export default class Section extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: []
    };
  }

  componentDidMount() {
    import(`../tests/${this.props.testNum}/${this.props.section}.csv`)
      .then(async questionsPath => {
        const questions = await csv(questionsPath.default);
        console.log(questions);
      });
  }

  render() {
    return (
      <div className='section-wrap'>
        {this.state.questions.map(d => <Question />)}
      </div>
    );
  }

}

