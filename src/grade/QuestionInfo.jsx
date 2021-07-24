import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import './question-info.css';

export default class QuestionInfo extends React.Component {

  constructor(props) {
    super(props);

    this.bodyRef = React.createRef();

    this.state = {
      isCollapsed: false
    }
  }

  handleToggle() {
    if(this.state.isCollapsed) {
      this.bodyRef.current.classList.add('show');
    }
    else {
      this.bodyRef.current.classList.remove('show');
    }
    this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }));
  }

  render() {
    return <div className={`question-info ${this.props.isFloating ? 'question-info-static' : 'question-info-sticky'}`}>
      <div className='question-info-header' onClick={this.handleToggle.bind(this)}>
        <div className='question-info-chevron-holder'>
          {
            this.state.isCollapsed
            ? <span className='fas fa-chevron-right'/>
            : <span className='fas fa-chevron-down'/>
          }
        </div> {/* adds space between chevron and title */}
        {
          !this.props.isActive
          ? 'No Question Selected'
          : <>
            {
              this.props.section === 'reading' ? 'Reading'
              : this.props.section === 'writing' ? 'Writing'
              : this.props.section === 'math_no_calc' ? 'Math (Non-Calculator)'
              : 'Math (Calculator)'
            } - 
            Question {this.props.questionNumber} - {/* adds space between dash and text*/}
            {
              this.props.question.type === 'mcq'
              ? 'Multiple Choice'
              : 'Short Answer'
            }
          </>
        }
      </div>
      <div className='question-info-body collapse show' ref={this.bodyRef}>
        {
          !this.props.isActive
          ? <p>Click on a question to view additional information, or click on the header to collapse this box.</p>
          : !this.props.isGraded
          ? <>
            <p>This question must be graded before its answer explanation can be revealed.</p>
            <p>If you want to reveal the explanation now, you may grade this question individually.</p>
            <p>
              <Button 
                variant='grade' 
                onClick={() => this.props.changeGradedQuestion(this.props.section, this.props.questionNumber-1)}
              >
                <span className='fas fa-edit' /> Grade Question
              </Button>
            </p>
          </>
          : <div className='question-info-explanation'>
            <p>
              {this.props.question.explanation}
            </p>
          </div>
        }
      </div>
    </div>
  }

}