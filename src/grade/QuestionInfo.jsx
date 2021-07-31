import React from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import './question-info.css';

export default class QuestionInfo extends React.Component {

  constructor(props) {
    super(props);

    this.bodyRef = React.createRef();
    this.iconRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.isActive !== nextProps.isActive 
      || this.props.isGraded !== nextProps.isGraded 
      || this.props.section !== nextProps.section 
      || this.props.questionNumber !== nextProps.questionNumber
      || this.props.isFloating !== nextProps.isFloating
      || this.props.windowWidth !== nextProps.windowWidth;
  }

  handleToggle() {
    if(!this.bodyRef.current.classList.contains('show')) {
      this.bodyRef.current.classList.add('show');
      this.iconRef.current.classList.remove('fa-chevron-right');
      this.iconRef.current.classList.add('fa-chevron-down');
    }
    else {
      this.bodyRef.current.classList.remove('show');
      this.iconRef.current.classList.remove('fa-chevron-down');
      this.iconRef.current.classList.add('fa-chevron-right');
    }
  }

  render() {
    if(this.bodyRef.current !== null && !this.bodyRef.current.classList.contains('show')) {
      this.handleToggle();
    }

    return <div className={`question-info ${this.props.isFloating ? 'question-info-static' : 'question-info-sticky'}`}>
      <div className='question-info-header' onClick={this.handleToggle.bind(this)}>
        <div className='question-info-chevron-holder'>
          <span className='fas fa-chevron-right' ref={this.iconRef} />
        </div> {/* adds space between chevron and title */}
        {
          this.props.windowWidth <= 700 ? (
            !this.props.isActive
            ? 'No Q Selected'
            : <>
              {
                this.props.section === 'reading' ? 'Reading'
                : this.props.section === 'writing' ? 'Writing'
                : this.props.section === 'math_no_calc' ? <> Math (No <span className='fas fa-calculator'/> )</>
                : <> Math (w/ <span className='fas fa-calculator'/> )</>
              } - 
              Q{this.props.questionNumber}
            </>
          )
          : (
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
          )
        }
      </div>
      <div className='question-info-body collapse show' ref={this.bodyRef}>
        {
          !this.props.isActive
          ? <>
            <p>Click on a question to view additional information, or click on the header to collapse this box.</p>
            <p><span className='fas fa-lightbulb'/> Tip: Type 1, 2, 3, 4 to quickly enter A, B, C, D into the question text input.</p>
          </>
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