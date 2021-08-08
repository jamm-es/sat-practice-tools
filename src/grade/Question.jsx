import React from 'react';
import PropTypes from 'prop-types';

import './question.css';

export default class Question extends React.Component {

  constructor(props) {
    super(props);

    this.highlightRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.graded !== nextProps.graded 
      || this.props.userAnswer !== nextProps.userAnswer
      || this.props.rerenderIndex !== nextProps.rerenderIndex
      || this.props.numColumns !== nextProps.numColumns;
  }

  componentDidMount() {
    if(this.props.sectionName === 'reading' && this.props.questionNumber === 1) {
      this.props.myRef.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.sectionName === 'reading' && this.props.questionNumber === 1 && prevProps.rerenderIndex !== this.props.rerenderIndex) {
      this.props.myRef.current.focus();
    }
  }

  handleMCQInput(e) {
    if(!this.props.graded) {
      let processedOutput = e.target.value
        .toUpperCase()
        .replace(/[^A-D1-4]/g, '')
        .replace('1', 'A')
        .replace('2', 'B')
        .replace('3', 'C')
        .replace('4', 'D')

      const isSameInput = processedOutput[0] === processedOutput[1];
      
      if(processedOutput.length === 2) {
        processedOutput = processedOutput.charAt(1);
      }

      if(processedOutput !== '' && !isSameInput && this.props.nextRef !== null) {
        this.props.nextRef.current.focus();
      }

      this.props.handleAnswerChange(this.props.sectionName, this.props.questionNumber, processedOutput);
    }
  }

  handleSAQInput(e) {
    let processedOutput = e.target.value
      .replace(/[^0-9/\.]/g, '');

    if(processedOutput.length === 4 && this.props.nextRef !== null) {
      this.props.nextRef.current.focus();
    }

    this.props.handleAnswerChange(this.props.sectionName, this.props.questionNumber, processedOutput);
  }

  handleBackgroundClick(e) {
    e.preventDefault();
    if(e.target === e.currentTarget || this.props.graded) {
      this.props.handleShowAnswer(this.props.sectionName, this.props.questionNumber, this.highlightRef.current)
    }
  }

  handleMouseEnter() {
    this.highlightRef.current.classList.add('hovered');
  }

  handleMouseLeave() {
    this.highlightRef.current.classList.remove('hovered');
  }

  render() {
    console.log(this.props.rowNum, this.props.colNum);
    return <div 
      className={`question ${this.props.graded ? 'question-graded' : ''} ${this.props.doHighlightBackground ? 'question-background-accent' : ''}`} 
      onMouseEnter={this.handleMouseEnter.bind(this)}
      onMouseLeave={this.handleMouseLeave.bind(this)}
      style={{gridRow: this.props.rowNum, gridColumn: this.props.colNum*2-1}}
    >

      <div className='question-select-highlight' ref={this.highlightRef} onClick={this.handleBackgroundClick.bind(this)} />

      <span className='question-number' >
        {this.props.questionNumber}:
      </span>
      
      <div className='question-divider' />

      {(() => {
        if(this.props.type === 'mcq') {
          return <>
            <input className='question-text' value={this.props.userAnswer}
              onChange={this.handleMCQInput.bind(this)}
              disabled={this.props.graded}
              ref={this.props.myRef}
              placeholder={['A', 'B', 'C', 'D'][(this.props.questionNumber-1) % 4]}
            ></input>{/* user answer text box*/}

            <div className='question-divider' />
            
            <div 
              className='question-radio-selecter'
              onClick={() => {if(!this.props.graded) this.props.handleAnswerChange(this.props.sectionName, this.props.questionNumber, 'A');}}
            >
              <div className={`question-radio ${this.props.userAnswer === 'A' ? 'question-radio-selected' : ''}`} >
                A
              </div>
            </div>
            <div 
              className='question-radio-selecter'
              onClick={() => {if(!this.props.graded) this.props.handleAnswerChange(this.props.sectionName, this.props.questionNumber, 'B');}}
            >
              <div className={`question-radio ${this.props.userAnswer === 'B' ? 'question-radio-selected' : ''}`} >
                B
              </div>
            </div>
            <div 
              className='question-radio-selecter'
              onClick={() => {if(!this.props.graded) this.props.handleAnswerChange(this.props.sectionName, this.props.questionNumber, 'C');}}
            >
              <div className={`question-radio ${this.props.userAnswer === 'C' ? 'question-radio-selected' : ''}`} >
                C
              </div>
            </div>
            <div 
              className='question-radio-selecter'
              onClick={() => {if(!this.props.graded) this.props.handleAnswerChange(this.props.sectionName, this.props.questionNumber, 'D');}}
            >
              <div className={`question-radio ${this.props.userAnswer === 'D' ? 'question-radio-selected' : ''}`} >
                D
              </div>
            </div>

          </>  
        }
        else if(this.props.type === 'saq') {
          return <>
            <input className='question-text question-saq' 
              value={this.props.userAnswer}
              placeholder='23/7'
              maxLength={4}
              onChange={this.handleSAQInput.bind(this)}
              disabled={this.props.graded}
              ref={this.props.myRef}
            />
          </>
        }
      })()}
      
      

      <div className='question-divider' />

      <div className={`question-check ${this.props.type === 'saq' ? 'question-check-saq' : ''}`} >
        {
          !this.props.graded
            ? '?'
            : this.props.correct
            ? <span className='question-check-right fas fa-check'/>
            : <div className='question-check-wrong'>{this.props.answer}</div>
        }
      </div>
    </div>;
  }

}

Question.propTypes = {
  doHighlightBackground: PropTypes.bool,
  sectionName: PropTypes.string,
  questionNumber: PropTypes.number,
  answer: PropTypes.string,
  userAnswer: PropTypes.string,
  graded: PropTypes.bool,
  handleAnswerChange: PropTypes.func,
  handleGradedQuestionChange: PropTypes.func,
  type: PropTypes.string,
  handleShowAnswer: PropTypes.func,
  rerenderIndex: PropTypes.number,
  compactMode: PropTypes.bool,
  numColumns: PropTypes.number,
  rowNum: PropTypes.number
}