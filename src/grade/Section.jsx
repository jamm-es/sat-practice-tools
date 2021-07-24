import React from 'react';
import PropTypes from 'prop-types';

import {default as Question} from './Question';

import './section.css';
import './footer.css';

export default class Section extends React.Component {

  constructor(props) {
    super(props);

    this.collapseRef = React.createRef();
    this.collapseIconRef = React.createRef();
    this.compactCollapseRef = React.createRef();
    this.compactCollapseIconRef = React.createRef();

    this.questionRefs = [];
    for(let i = 0; i < this.props.questions.length; ++i) {
      this.questionRefs[i] = React.createRef();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.shouldRerender || this.props.weighted !== nextProps.weighted) {
      return true;
    }

    let numCurrentGraded = 0;
    let numNextGraded = 0;
    for(let i = 0; i < this.props.graded.length; ++i) {
      if(this.props.graded[i]) ++numCurrentGraded;
      if(nextProps.graded[i]) ++numNextGraded;
    }
    return numCurrentGraded !== numNextGraded;
  }

  getPrintedSectionName() {
    switch(this.props.sectionName) {
      case 'math_no_calc':
        return this.props.compactMode ? <> Math (No <span className='fas fa-calculator'/> )</> : 'Math (Non-Calculator)';
      case 'math_calc':
        return this.props.compactMode ? <>Math (w/ <span className='fas fa-calculator'/> )</> : 'Math (Calculator)';
      case 'reading':
        return 'Reading';
      case 'writing':
        return 'Writing';
    }
  }

  handleSectionCollapse() {
    if(this.props.compactMode) {
      if(this.compactCollapseRef.current.classList.contains('show')) {
        this.compactCollapseRef.current.classList.remove('show');

        this.collapseIconRef.current.classList.remove('fa-chevron-down');
        this.collapseIconRef.current.classList.add('fa-chevron-right');

        this.compactCollapseIconRef.current.classList.remove('fa-chevron-up');
        this.compactCollapseIconRef.current.classList.add('fa-chevron-down');
      }
      else {
        this.compactCollapseRef.current.classList.add('show');

        this.collapseIconRef.current.classList.add('fa-chevron-down');
        this.collapseIconRef.current.classList.remove('fa-chevron-right');

        this.compactCollapseIconRef.current.classList.add('fa-chevron-up');
        this.compactCollapseIconRef.current.classList.remove('fa-chevron-down');
      }
    }
    else {
      if(this.collapseRef.current.classList.contains('show')) {
        this.collapseRef.current.classList.remove('show');

        this.collapseIconRef.current.classList.remove('fa-chevron-down');
        this.collapseIconRef.current.classList.add('fa-chevron-right');
      }
      else {
        this.collapseRef.current.classList.add('show');

        this.collapseIconRef.current.classList.add('fa-chevron-down');
        this.collapseIconRef.current.classList.remove('fa-chevron-right');
      }
    }
  }

  render() {
    const questionTypes = this.props.questions.map(d => d.type).filter((value, index, self) => self.indexOf(value) === index);
    const isScoresUnknown = this.props.numCorrect === 0 && !this.props.graded.some(d => d);
    return (
      <div className='section-wrapper'>
        <div className='section-title-bottom' onClick={this.handleSectionCollapse.bind(this)}/>
        <div className='section-title-segment' onClick={this.handleSectionCollapse.bind(this)}>
          <h2>
            <span className={`section-collapse-icon fas fa-chevron-down`} ref={this.collapseIconRef}/> {this.getPrintedSectionName()}
          </h2>
          <div className='section-title-triangle'/>
        </div>
        <div className='section collapse show' ref={this.compactCollapseRef}>
          <div className='collapse show' ref={this.collapseRef}>
            {questionTypes.map((questionType) => {
              const questionTypeQuestions = this.props.questions.filter(d => d.type === questionType);
              return <div className={`section-columns`} 
                style={{ 
                  columnCount: this.props.numColumns, height: 26 * Math.ceil((questionTypeQuestions.length+1) / this.props.numColumns),
                  columnRule: this.props.numColumns !== 1 ? '2px solid #B5AEA4' : undefined
                }}
              >
                <div className='section-column-relative'>
                  <div className={'section-center'}>
                    {questionTypeQuestions.map((d, i) => <>
                        <Question
                          doHighlightBackground={i % (Math.ceil((questionTypeQuestions.length+1) / this.props.numColumns)) % 2 === 0 }
                          sectionName={this.props.sectionName}
                          questionNumber={d.question_number} 
                          answer={d.answer} 
                          userAnswer={this.props.userAnswer[d.question_number-1]}
                          graded={this.props.graded[d.question_number-1]}
                          handleAnswerChange={this.props.handleAnswerChange.bind(this)} 
                          type={d.type}
                          correct={this.props.correct[d.question_number-1]}
                          myRef={this.questionRefs[d.question_number-1]}
                          nextRef={+d.question_number !== this.props.questions.length ? this.questionRefs[d.question_number] : null}
                          handleShowAnswer={this.props.handleShowAnswer.bind(this)}
                          key={i}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            })}
          </div>
          <div className={`grade-footer ${this.props.compactMode ? 'grade-footer-compact' : ''}`}>
            <div className='grade-footer-aligner' style={{textAlign: 'left'}}>
              <div className='grade-footer-score'>
                {
                  this.props.sectionName === 'math_no_calc'
                  ? <>
                    <div>
                      Weighted:
                    </div>
                    <div className='grade-footer-score-numbers-wrapper'>
                      <div className='grade-footer-score-main'>
                        N/A
                      </div>
                    </div>
                  </>
                  : <>
                      <div>
                        Weighted:
                      </div>
                      <div className='grade-footer-score-numbers-wrapper'>
                        <div className='grade-footer-score-main'>
                          {isScoresUnknown && this.props.sectionName !== 'math_calc' ? '?' : this.props.weighted}
                        </div>
                        <div className='grade-footer-score-range'>
                          {
                            this.props.sectionName === 'math_calc'
                            ? <>
                              <div>200 to</div>
                              <div>800</div>
                            </>
                            : <>
                              <div>100 to</div>
                              <div>400</div>                          
                            </>
                          }
                        </div>
                      </div>
                    </>
                }
              </div>
              <div className='grade-footer-score grade-footer-score-raw'>
                <div>
                  Raw:
                </div>
                <div className='grade-footer-score-numbers-wrapper'>
                  <div className={`grade-footer-score-main ${this.props.numCorrect === this.props.questions.length ? 'grade-footer-correct' : ''}`}>
                    {isScoresUnknown ? '?' : this.props.numCorrect}
                  </div>
                  <div className='grade-footer-score-range'>
                    <div>/{this.props.questions.length}</div>
                  </div>
                </div>
              </div>
              <div className='grade-footer-score grade-footer-score-raw'>
                <div>
                  Answered:
                </div>
                <div className='grade-footer-score-numbers-wrapper'>
                  <div className={`grade-footer-score-main ${this.props.numAnswered === this.props.questions.length ? 'grade-footer-correct' : ''}`}>
                    {this.props.numAnswered}
                  </div>
                  <div className='grade-footer-score-range'>
                    <div>/{this.props.questions.length}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='grade-footer-aligner' style={{textAlign: 'right'}}>
              <button type='button' className='grade-button btn' disabled={this.props.graded.every(d => d)}
                onClick={() => {
                  this.props.handleGradedSectionChange(this.props.sectionName);
                }} 
              >
                <span className='fas fa-edit' /> Grade Section
              </button>
            </div>
          </div>
        </div>
        {
          this.props.compactMode
          ? <div onClick={this.handleSectionCollapse.bind(this)} className='section-compact-collapse-tab'>
            <span className='fas fa-chevron-up' ref={this.compactCollapseIconRef}/>
          </div>
          : <></>
        }
      </div>
    );
  }

}

Section.propTypes = {
  sectionName: PropTypes.string,
  questions: PropTypes.array,
  userAnswer: PropTypes.array,
  graded: PropTypes.array,
  correct: PropTypes.array,
  handleAnswerChange: PropTypes.func,
  handleGradedQuestionChange: PropTypes.func,
  handleGradedSectionChange: PropTypes.func,
  numCorrect: PropTypes.number,
  numAnswered: PropTypes.number,
  shouldRerender: PropTypes.bool,
  numColumns: PropTypes.number,
  compactMode: PropTypes.bool
};