import React from 'react';
import PropTypes from 'prop-types';

import './score-summary.css';
import './footer.css';

export default class ScoreSummary extends React.Component {

  constructor(props) {
    super(props);



    this.state = {
      isCollapsed: this.props.isFloating,
      mathLinear: [],
      mathRates: [],
      mathQuad: [],
      englishOrg: [],
      englishGrammar: [],
      englishWords: [],
      englishEvidence: [],
      readingQuestionsLength: 0, // used to check if recount is necessary
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isCollapsed !== nextState.isCollapsed 
      || !nextState.isCollapsed 
      || this.props.isFloating !== nextProps.isFloating
      || this.props.pressedGradeButtonIndex !== nextProps.pressedGradeButtonIndex
      || this.props.rerenderIndex !== nextProps.rerenderIndex;
  }

  componentDidUpdate(prevProps) {
    if(prevProps.pressedGradeButtonIndex !== this.props.pressedGradeButtonIndex) {
      this.setState({ isCollapsed: false })
    }
    if(prevProps.rerenderIndex !== this.props.rerenderIndex) {
      this.setState({ isCollapsed: this.props.isFloating })
    }
  }

  createTagFilteredArray(tag) {
    const indexes = [];
    for(let i = 0; i < this.props.reading_questions.length; ++i) {
      if(this.props.reading_questions[i].tags.replaceAll(/[^A-Z_,]/g, '').split(',').includes(tag)) indexes.push({ section: 'reading', index: i });
    }
    for(let i = 0; i < this.props.writing_questions.length; ++i) {
      if(this.props.writing_questions[i].tags.split(',').includes(tag)) indexes.push({ section: 'writing', index: i });
    }
    for(let i = 0; i < this.props.math_no_calc_questions.length; ++i) {
      if(this.props.math_no_calc_questions[i].tags.split(',').includes(tag)) indexes.push({ section: 'math_no_calc', index: i });
    }
    for(let i = 0; i < this.props.math_calc_questions.length; ++i) {
      if(this.props.math_calc_questions[i].tags.split(',').includes(tag)) indexes.push({ section: 'math_calc', index: i });
    }
    return indexes;
  }

  countCorrectFromTagState(tagState) {
    let numCorrect = 0;
    for(const question of this.state[tagState]) {
      numCorrect += this.props[`${question.section}_correct`][question.index];
    }
    return numCorrect;
  }

  determineQuestionClass(ratio) {
    if(ratio === '?') {
      return;
    }
    else if(ratio === 1) {
      return 'score-summary-perfect';
    }
    else if(ratio >= 0.8) {
      return 'score-summary-ok';
    }
    else if(ratio >= 0.5) {
      return 'score-summary-warn';
    }
    else {
      return 'score-summary-bad'
    }
  }

  determineQuestionIcon(ratio) {
    if(ratio === '?') {
      return;
    }
    else if(ratio === 1) {
      return <span className='fas fa-star' />;
    }
    else if(ratio >= 0.8) {
      return;
    }
    else if(ratio >= 0.5) {
      return <span className='fas fa-exclamation-triangle' />;
    }
    else {
      return <span className='fas fa-exclamation-triangle' />;
    }
  }

  render() {
    // check if number of each category needs to be recalculated
    if(this.state.readingQuestionsLength !== this.props.reading_questions.length) {
      this.setState({
        englishOrg: this.createTagFilteredArray('EXPRESSION_OF_IDEAS'),
        englishGrammar: this.createTagFilteredArray('STANDARD_ENGLISH_CONVENTIONS'),
        englishWords: this.createTagFilteredArray('WORDS_IN_CONTEXT'),
        englishEvidence: this.createTagFilteredArray('COMMAND_OF_EVIDENCE'),
        mathLinear: this.createTagFilteredArray('HEART_OF_ALGEBRA'),
        mathRates: this.createTagFilteredArray('PROBLEM_SOLVING_AND_DATA_ANALYSIS'),
        mathQuad: this.createTagFilteredArray('PASSPORT_TO_ADVANCED_MATH'),
        readingQuestionsLength: this.props.reading_questions.length
      });
    }

    if(this.state.isCollapsed && !this.props.isFloating) {
      this.setState({ isCollapsed: false });
    }

    const englishOrg = this.countCorrectFromTagState('englishOrg');
    const englishGrammar = this.countCorrectFromTagState('englishGrammar');
    const englishWords = this.countCorrectFromTagState('englishWords');
    const englishEvidence = this.countCorrectFromTagState('englishEvidence');
    const mathLinear = this.countCorrectFromTagState('mathLinear');
    const mathRates = this.countCorrectFromTagState('mathRates');
    const mathQuad = this.countCorrectFromTagState('mathQuad');

    const englishOrgRatio = this.props.weightedEnglish === '?' ? '?' : englishOrg / this.state.englishOrg.length;
    const englishGrammarRatio = this.props.weightedEnglish === '?' ? '?' : englishGrammar / this.state.englishGrammar.length;
    const englishWordsRatio = this.props.weightedEnglish === '?' ? '?' : englishWords / this.state.englishWords.length;
    const englishEvidenceRatio =this.props.weightedEnglish === '?' ? '?' :  englishEvidence / this.state.englishEvidence.length;
    const mathLinearRatio = this.props.weightedMath === '?' ? '?' : mathLinear / this.state.mathLinear.length;
    const mathRatesRatio = this.props.weightedMath === '?' ? '?' : mathRates / this.state.mathRates.length;
    const mathQuadRatio = this.props.weightedMath === '?' ? '?' : mathQuad / this.state.mathQuad.length;
    
    return <div className={this.props.isFloating ? `score-summary-floating` : 'score-summary-block'}>
      <div className={`score-summary-tab ${!this.props.isFloating && 'd-none'}`} onClick={() => this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }))}>
        <div className='score-summary-tab-left'></div>
        <div className='score-summary-tab-title'>Score Summary</div>
        <div className='score-summary-tab-right'></div>
      </div>
      <div className={'score-summary-scroll-wrapper'} style={{maxHeight: this.props.isFloating ? 'calc(70vh - 45px)' : ''}}>
        <div className={`score-summary-body ${this.state.isCollapsed ? 'd-none' : ''}`}>
          <div className='score-summary-overall'>
            <div className='grade-footer-score'>
              <div>
                Final Score:
              </div>
              <div className='grade-footer-score-numbers-wrapper'>
                <div className='grade-footer-score-main'>
                  {this.props.weightedOverall}
                </div>
                <div className='grade-footer-score-range'>
                  <div>400 to</div>
                  <div>1600</div>
                </div>
              </div>
            </div>
          </div>
          <div className='score-summary-horizontal' />
          <div className='score-summary-english'>
            <div className='grade-footer-score'>
              <div>
                Reading/Writing:
              </div>
              <div className='grade-footer-score-numbers-wrapper'>
                <div className='grade-footer-score-main'>
                  {this.props.weightedEnglish}
                </div>
                <div className='grade-footer-score-range'>
                  <div>200 to</div>
                  <div>800</div>
                </div>
              </div>
            </div>
          </div>
          <div className='score-summary-vertical' />
          <div className='score-summary-math'>
            <div className='grade-footer-score'>
              <div>
                Math:
              </div>
              <div className='grade-footer-score-numbers-wrapper'>
                <div className='grade-footer-score-main'>
                  {this.props.weightedMath}
                </div>
                <div className='grade-footer-score-range'>
                  <div>200 to</div>
                  <div>800</div>
                </div>
              </div>
            </div>
          </div>
          <div className='score-summary-horizontal' />
          <div className='score-summary-subscores-english'>
            {
              this.state.englishOrg.length === 0
              ? 'English skill scores are not available for this test.'
              : <>
                <div className={`grade-footer-score ${this.determineQuestionClass(englishOrgRatio)}`}>
                  <div>
                  {this.determineQuestionIcon(englishOrgRatio)} Organization and Impact:
                  </div>
                  <div className='grade-footer-score-numbers-wrapper'>
                    <div className='grade-footer-score-main'>
                      {englishOrgRatio === '?' ? '?' : englishOrg}
                    </div>
                    <div className='grade-footer-score-range'>
                      <div>/{this.state.englishOrg.length}</div>
                    </div>
                  </div>
                </div>
                <div className={`grade-footer-score ${this.determineQuestionClass(englishGrammarRatio)}`}>
                  <div>
                    {this.determineQuestionIcon(englishGrammarRatio)} Grammar:
                  </div>
                  <div className='grade-footer-score-numbers-wrapper'>
                    <div className='grade-footer-score-main'>
                      {englishGrammarRatio === '?' ? '?' : englishGrammar}
                    </div>
                    <div className='grade-footer-score-range'>
                      <div>/{this.state.englishGrammar.length}</div>
                    </div>
                  </div>
                </div>
                <div className={`grade-footer-score ${this.determineQuestionClass(englishWordsRatio)}`}>
                  <div>
                    
                    {this.determineQuestionIcon(englishWordsRatio)} Words in Context:
                  </div>
                  <div className='grade-footer-score-numbers-wrapper'>
                    <div className='grade-footer-score-main'>
                      {englishWordsRatio === '?' ? '?' : englishWords}
                    </div>
                    <div className='grade-footer-score-range'>
                      <div>/{this.state.englishWords.length}</div>
                    </div>
                  </div>
                </div>
                <div className={`grade-footer-score ${this.determineQuestionClass(englishEvidenceRatio)}`}>
                  <div>
                    
                    {this.determineQuestionIcon(englishEvidenceRatio)} Using Evidence:
                  </div>
                  <div className='grade-footer-score-numbers-wrapper'>
                    <div className='grade-footer-score-main'>
                      {englishEvidenceRatio === '?' ? '?' : englishEvidence}
                    </div>
                    <div className='grade-footer-score-range'>
                      <div>/{this.state.englishEvidence.length}</div>
                    </div>
                  </div>
                </div>
              </>
            }
          </div>
          <div className='score-summary-vertical' />
          <div className='score-summary-subscores-math'>
            {
              this.state.mathLinear.length === 0
              ? 'Math skill scores are not available for this test.'
              : <>
                <div className={`grade-footer-score ${this.determineQuestionClass(mathLinearRatio)}`}>
                  <div>
                    {this.determineQuestionIcon(mathLinearRatio)} Linear Equations:
                  </div>
                  <div className='grade-footer-score-numbers-wrapper'>
                    <div className='grade-footer-score-main'>
                      {mathLinearRatio === '?' ? '?' : mathLinear}
                    </div>
                    <div className='grade-footer-score-range'>
                      <div>/{this.state.mathLinear.length}</div>
                    </div>
                  </div>
                </div>
                <div className={`grade-footer-score ${this.determineQuestionClass(mathRatesRatio)}`}>
                  <div>
                  {this.determineQuestionIcon(mathRatesRatio)} Rates and Data Analysis:
                  </div>
                  <div className='grade-footer-score-numbers-wrapper'>
                    <div className='grade-footer-score-main'>
                      {mathRatesRatio === '?' ? '?' : mathRates}
                    </div>
                    <div className='grade-footer-score-range'>
                      <div>/{this.state.mathRates.length}</div>
                    </div>
                  </div>
                </div>
                <div className={`grade-footer-score ${this.determineQuestionClass(mathQuadRatio)}`}>
                  <div>
                    {this.determineQuestionIcon(mathQuadRatio)} Quadratics, Polynomials, Exponentials:
                  </div>
                  <div className='grade-footer-score-numbers-wrapper'>
                    <div className='grade-footer-score-main'>
                      {mathQuadRatio === '?' ? '?' : mathQuad}
                    </div>
                    <div className='grade-footer-score-range'>
                      <div>/{this.state.mathQuad.length}</div>
                    </div>
                  </div>
                </div>
              </>
            }
          </div>
          <div className='score-summary-horizontal score-summary-horizontal-compact score-summary-row-5'/>
        </div>
      </div>
    </div>
  }

}

ScoreSummary.propTypes = {
  reading_correct: PropTypes.array,
  writing_correct: PropTypes.array, 
  math_no_calc_correct: PropTypes.array,
  math_calc_correct: PropTypes.array,
  reading_questions: PropTypes.array,
  writing_questions: PropTypes.array, 
  math_no_calc_questions: PropTypes.array,
  math_calc_questions: PropTypes.array,
  weightedMath: PropTypes.string,
  weightedEnglish: PropTypes.string,
  weightedOverall: PropTypes.string,
  isFloating: PropTypes.bool,
}