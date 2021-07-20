import React from 'react';
import PropTypes from 'prop-types';
import {csv} from 'd3';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import {default as Section} from './Section';

import './grade.css';
import './footer.css';

export default class Grade extends React.Component {

  constructor(props) {
    super(props);

    this.weightsCategories = ['math', 'reading', 'writing']

    this.state = {
      sections: [],
      showBlankAnswersModal: false,
      gradeAnyways: false,
      curSectionToGrade: undefined,
      curQuestionToGrade: undefined,
      suppressModal: false,
      graded: false,
      rerenderSection: '',
      math_weights: [],
      reading_weights: [],
      writing_weights: [],
      math_calc_num_answered: 0,
      math_no_calc_num_answered: 0,
      reading_num_answered: 0,
      writing_num_answered: 0,
      math_calc_num_correct: 0,
      math_no_calc_num_correct: 0,
      reading_num_correct: 0,
      writing_num_correct: 0,
    };
  }

  componentDidMount() {
    import(`../data/tests/${this.props.test}.csv`)
      .then(async questionsPath => {
        const questions = await csv(questionsPath.default);
        const state = {};
        state.sections = questions.map(d => d.section).filter((value, index, self) => self.indexOf(value) === index);
        state.sections.forEach(section => {
          const numQuestions = questions.filter(d => d.section === section).length;
          state[`${section}_user_answers`] = new Array(numQuestions).fill('');
          state[`${section}_questions`] = questions.filter(d => d.section === section);
          state[`${section}_graded`] = new Array(numQuestions).fill(false);
          state[`${section}_correct`] = new Array(numQuestions).fill(false);
        });
        this.setState(state);
      });
    
    for(const weights of this.weightsCategories) {
      import(`../data/weights/${this.props.test}/${weights}.csv`)
        .then(async weightsPath => {
          const state = {};
          const weightsData = await csv(weightsPath.default);
          state[`${weights}_weights`] = [];
          for(const weight of weightsData) {
            state[`${weights}_weights`][weight.raw_score] = weight.weighted;
          }
          this.setState(state);
        }
      );
    }
  }

  changeAnswers(section, questionNum, answer) {
    const state = {};
    state[`${section}_user_answers`] = [...this.state[`${section}_user_answers`]];
    if(this.state[`${section}_user_answers`][questionNum-1] === answer) {
      state[`${section}_user_answers`][questionNum-1] = '';
      state[`${section}_num_answered`] = this.state[`${section}_num_answered`] - 1;
    }
    else {
      if(this.state[`${section}_user_answers`][questionNum-1] === '') {
        state[`${section}_num_answered`] = this.state[`${section}_num_answered`] + 1;
      }
      state[`${section}_user_answers`][questionNum-1] = answer;
    }
    state['rerenderSection'] = section;
    this.setState(state);
  }

  gradeQuestion(userAnswer, answer, type) {
    return type === 'mcq' && userAnswer === answer.toUpperCase()
    || type === 'saq' && answer.split(',').includes(userAnswer);
  }

  changeGradedQuestion(section, i, gradeAnyways) {
    if(!this.state.suppressModal && !gradeAnyways && this.state[`${section}_user_answers`][i-1] === '') {
      this.setState({
        showBlankAnswersModal: true,
        curSectionToGrade: section,
        curQuestionToGrade: i
      });
    }
    else {
      const state = {};
      const isCorrect = this.gradeQuestion(this.state[`${section}_user_answers`][i-1], this.state[`${section}_questions`][i-1].answer, this.state[`${section}_questions`][i-1].type);
      state[`${section}_graded`] = [...this.state[`${section}_graded`]];
      state[`${section}_user_answers`] = [...this.state[`${section}_user_answers`]];
      state[`${section}_correct`] = [...this.state[`${section}_correct`]];
      state[`${section}_graded`][i-1] = true;
      state[`${section}_user_answers`][i-1] = this.state[`${section}_user_answers`][i-1] === '' ? '~' : this.state[`${section}_user_answers`][i-1];
      state[`${section}_correct`][i-1] = isCorrect;
      this.setState(prevState => {
        state[`${section}_num_correct`] = prevState[`${section}_num_correct`] + (isCorrect ? 1 : 0); 
        return state
      });
    }
  }

  changeGradedSection(section, gradeAnyways) {
    if(!this.state.suppressModal && !gradeAnyways && this.state[`${section}_user_answers`].some(d => d === '')) {
      this.setState({
        showBlankAnswersModal: true,
        curSectionToGrade: section,
      });
    }
    else {
      const numQuestions = this.state[`${section}_questions`].length;
      const state = {};
      state[`${section}_graded`] = new Array(numQuestions).fill(true);
      state[`${section}_user_answers`] = this.state[`${section}_user_answers`].map(d => d === '' ? '~' : d);
      state[`${section}_correct`] = new Array(numQuestions);
      state[`${section}_num_correct`] = 0;
      state[`${section}_num_answered`] = state[`${section}_user_answers`].filter(d => d !== '~').length;
      for(let i = 0; i < numQuestions; ++i) {
        const isCorrect = this.gradeQuestion(this.state[`${section}_user_answers`][i], this.state[`${section}_questions`][i].answer, this.state[`${section}_questions`][i].type);
        state[`${section}_correct`][i] = isCorrect;
        if(isCorrect) ++state[`${section}_num_correct`];
      }
      this.setState(state);
    }
  }

  changeGradedTest(gradeAnyways) {
    let anyUnansweredQuestions = false;
    this.state.sections.forEach(section => {
      anyUnansweredQuestions = anyUnansweredQuestions || this.state[`${section}_user_answers`].some(d => d === '');
    });
    if(!this.state.suppressModal && !gradeAnyways && anyUnansweredQuestions) {
      this.setState({
        showBlankAnswersModal: true,
      });
    }
    else {
      const state = {};
      state.graded = true;
      this.state.sections.forEach(section => {
        const numQuestions = this.state[`${section}_questions`].length;
        state[`${section}_graded`] = new Array(numQuestions).fill(true);
        state[`${section}_user_answers`] = this.state[`${section}_user_answers`].map(d => d === '' ? '~' : d);
        state[`${section}_correct`] = new Array(numQuestions);
        state[`${section}_num_correct`] = 0;
        state[`${section}_num_answered`] = state[`${section}_user_answers`].filter(d => d !== '~').length;
        for(let i = 0; i < numQuestions; ++i) {
          const isCorrect = this.gradeQuestion(this.state[`${section}_user_answers`][i], this.state[`${section}_questions`][i].answer, this.state[`${section}_questions`][i].type);
          state[`${section}_correct`][i] = isCorrect;
          if(isCorrect) ++state[`${section}_num_correct`];
        }
      });
      this.setState(state);
    }
  }

  gradeAnyways() {
    if(typeof this.state.curQuestionToGrade !== 'undefined') {
      this.changeGradedQuestion(this.state.curSectionToGrade, this.state.curQuestionToGrade, true);
      this.setState({
        curQuestionToGrade: undefined,
        curSectionToGrade: undefined
      });
    }
    else if(typeof this.state.curSectionToGrade !== 'undefined') {
      this.changeGradedSection(this.state.curSectionToGrade, true);
      this.setState({
        curSectionToGrade: undefined
      });
    }
    else {
      this.changeGradedTest(true);
    }
  }

  render() {
    console.log(this.props.numColumns);
    const weightedSections = {};
    for(let section of this.state.sections) {
      let weighted = '?';
      if(section === 'reading' || section === 'writing') {
        weighted = this.state[`${section}_weights`][this.state[`${section}_num_correct`]] * 10;
      }
      else if(section === 'math_calc') {
        if(this.state[`math_no_calc_graded`].some(d => d) || this.state[`math_calc_graded`].some(d => d)) {
          weighted = this.state['math_weights'][this.state[`math_calc_num_correct`] + this.state[`math_no_calc_num_correct`]] * 10;
        }
      }
      weightedSections[section] = weighted;
    }

    let englishSectionWeighted = '?';
    if(typeof this.state['reading_graded'] !== 'undefined') {
      englishSectionWeighted = this.state[`reading_graded`].some(d => d) || this.state[`writing_graded`].some(d => d)
        ? weightedSections['reading'] + weightedSections['writing']
        : '?';
    }
    const mathSectionWeighted = weightedSections['math_calc']

    const overallWeighted = englishSectionWeighted !== '?' &&  mathSectionWeighted !== '?' ? englishSectionWeighted + mathSectionWeighted : '?';

    return (
      <div>
        {this.state.sections.map(section => 
          <Section 
            key={section}
            sectionName={section}
            questions={this.state[`${section}_questions`]} 
            userAnswer={this.state[`${section}_user_answers`]}
            graded={this.state[`${section}_graded`]}
            correct={this.state[`${section}_correct`]}
            handleAnswerChange={this.changeAnswers.bind(this)}
            handleGradedQuestionChange={this.changeGradedQuestion.bind(this)}
            handleGradedSectionChange={this.changeGradedSection.bind(this)}
            numCorrect={this.state[`${section}_num_correct`]}
            numAnswered={this.state[`${section}_num_answered`]}
            weighted={weightedSections[section]}
            shouldRerender={section === this.state.rerenderSection}
            numColumns={this.props.numColumns}
            compactMode={this.props.compactMode}
          />
        )}
        <div className={`grade-footer ${this.props.compactMode ? 'grade-footer-compact' : ''}`}>
          <div className='grade-footer-aligner' style={{textAlign: 'left'}}>
            <div className='grade-footer-score'>
              <div>
                Reading/Writing:
              </div>
              <div className='grade-footer-score-numbers-wrapper'>
                <div className='grade-footer-score-main'>
                  {englishSectionWeighted}
                </div>
                <div className='grade-footer-score-range'>
                  <div>200 to</div>
                  <div>800</div>
                </div>
              </div>
            </div>
            <div className='grade-footer-score'>
              <div>
                Math:
              </div>
              <div className='grade-footer-score-numbers-wrapper'>
                <div className='grade-footer-score-main'>
                  {mathSectionWeighted}
                </div>
                <div className='grade-footer-score-range'>
                  <div>200 to</div>
                  <div>800</div>
                </div>
              </div>
            </div>
          </div>
          <div className='grade-footer-aligner' style={{textAlign: 'right'}}>
            <button type='button' className='grade-button btn' disabled={this.state.graded}
              onClick={() => {
                this.changeGradedTest();
              }} 
            >
              <span className='fas fa-edit' /> Grade Test
            </button>
          </div>
        </div>
        <div className='grade-footer-score grade-final'>
          <div>
            Final Score:
          </div>
          <div className='grade-footer-score-numbers-wrapper'>
            <div className='grade-footer-score-main'>
              {overallWeighted}
            </div>
            <div className='grade-footer-score-range'>
              <div>400 to</div>
              <div>1600</div>
            </div>
          </div>
        </div>
        <Modal show={this.state.showBlankAnswersModal} onHide={() => this.setState({showBlankAnswersModal: false})}>
          <Modal.Header>
            <Modal.Title>Unanswered Questions Remain</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            On the SAT, you are not penalized for incorrect answers.
            To earn the highest score, make sure to answer every question even if you're unsure.
          </Modal.Body>
          <Modal.Body>
            <input type='checkbox' id='grade-suppress-modal' className='form-check-input' 
              value={this.state.suppressModal} 
              onChange={ () => this.setState( prevState => ({ suppressModal: !prevState.suppressModal }) ) }
            /> {/* comment adds a space between checkbox and label */}
            <label for='grade-suppress-modal' className='form-check-label'>
              Stop showing this warning
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='sub' onClick={() => {this.gradeAnyways(); this.setState({showBlankAnswersModal: false});}}>
              <span className='fas fa-edit' /> Grade Anyways
            </Button>
            <Button variant='main' onClick={() => this.setState({showBlankAnswersModal: false})}>
              <span className='fas fa-pen-nib' /> Change Answers
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

}

Grade.propTypes = {
  test: PropTypes.string,
  numColumns: PropTypes.number,
  compactMode: PropTypes.bool
}

Grade.defaultProps = {
  numColumns: 3,
  compactMode: false
}