import React from 'react';
import PropTypes from 'prop-types';
import {csv} from 'd3';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {Redirect} from 'react-router-dom';

import {default as Section} from './Section';
import {default as QuestionInfo} from './QuestionInfo';
import {default as ScoreSummary} from './ScoreSummary';

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
      isQuestionInfoActive: false,
      questionInfoSection: 'reading',
      questionInfoIndex: 0,
      oldHighlightedElement: undefined,
      failedToLoad: false,
      pressedGradeButtonIndex: 0
    };
  }

  componentDidMount() {
    import(`../data/tests/${this.props.test}.csv`)
      .then(async questionsPath => {
        const questions = await csv(questionsPath.default);
        const state = {};
        state.allQuestions = questions;
        state.sections = questions.map(d => d.section).filter((value, index, self) => self.indexOf(value) === index);
        state.sections.forEach(section => {
          const numQuestions = questions.filter(d => d.section === section).length;
          state[`${section}_user_answers`] = new Array(numQuestions).fill('');
          state[`${section}_questions`] = questions.filter(d => d.section === section);
          state[`${section}_graded`] = new Array(numQuestions).fill(false);
          state[`${section}_correct`] = new Array(numQuestions).fill(false);
        });
        this.setState(state);
      })
      .catch(() => this.setState({ failedToLoad: true }));

    if(this.props.thirdPartyMode) {
      import(`../data/weights/estimated.csv`)
        .then(async weightsPath => {
          const state = {};
          const weightsData = await csv(weightsPath.default);
          for(const weightsCategory of this.weightsCategories) {
            state[`${weightsCategory}_weights`] = [];
            for(const weight of weightsData.filter(d => d.section === weightsCategory)) {
              state[`${weightsCategory}_weights`][weight.raw_score] = weight.weighted;
            }
          }
          this.setState(state);
        })
        .catch(() => this.setState({ failedToLoad: true }));
    }
    else {
      import(`../data/weights/${this.props.test}.csv`)
        .then(async weightsPath => {
          const state = {};
          const weightsData = await csv(weightsPath.default);
          for(const weightsCategory of this.weightsCategories) {
            state[`${weightsCategory}_weights`] = [];
            for(const weight of weightsData.filter(d => d.section === weightsCategory)) {
              state[`${weightsCategory}_weights`][weight.raw_score] = weight.weighted;
            }
          }
          this.setState(state);
        })
        .catch(() => this.setState({ failedToLoad: true }));
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
    if(!this.state.suppressModal && !gradeAnyways && this.state[`${section}_user_answers`][i] === '') {
      this.setState({
        showBlankAnswersModal: true,
        curSectionToGrade: section,
        curQuestionToGrade: i
      });
    }
    else {
      const state = {};
      const isCorrect = this.gradeQuestion(this.state[`${section}_user_answers`][i], this.state[`${section}_questions`][i].answer, this.state[`${section}_questions`][i].type);
      state[`${section}_graded`] = [...this.state[`${section}_graded`]];
      state[`${section}_user_answers`] = [...this.state[`${section}_user_answers`]];
      state[`${section}_correct`] = [...this.state[`${section}_correct`]];
      state[`${section}_graded`][i] = true;
      state[`${section}_user_answers`][i] = this.state[`${section}_user_answers`][i] === '' ? '~' : this.state[`${section}_user_answers`][i-1];
      state[`${section}_correct`][i] = isCorrect;
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
      this.setState(prevState => ({ ...state, pressedGradeButtonIndex: prevState.pressedGradeButtonIndex+1}));
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
      this.setState(prevState => ({ ...state, pressedGradeButtonIndex: prevState.pressedGradeButtonIndex+1}));
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

  handleShowAnswer(section, questionNumber, element) {

    if(typeof this.state.oldHighlightedElement !== 'undefined') {
      this.state.oldHighlightedElement.classList.remove('active');
    }

    if(section === this.state.questionInfoSection && questionNumber-1 === this.state.questionInfoIndex && this.state.isQuestionInfoActive) {
      this.setState({ isQuestionInfoActive: false });
    }
    else {
      element.classList.add('active');
      this.setState(() => ({ 
        questionInfoSection: section,
        questionInfoIndex: questionNumber-1,
        oldHighlightedElement: element,
        isQuestionInfoActive: true
      }));
    }
  }

  render() {
    if(this.state.failedToLoad) return <Redirect to='/not-found' />

    if(typeof this.state['reading_questions'] === 'undefined') return <></>;

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

    const englishSectionWeighted = this.state[`reading_graded`].some(d => d) || this.state[`writing_graded`].some(d => d)
      ? weightedSections['reading'] + weightedSections['writing']
      : '?';
    
    const mathSectionWeighted = weightedSections['math_calc']

    const overallWeighted = englishSectionWeighted !== '?' &&  mathSectionWeighted !== '?' ? englishSectionWeighted + mathSectionWeighted : '?';

    return <div className={this.props.testViewMode ? 'grade-compact' : ''}>
      <QuestionInfo 
        isActive={this.state.isQuestionInfoActive}
        section={this.state.questionInfoSection}
        questionNumber={this.state.questionInfoIndex+1}
        isGraded={this.state[`${this.state.questionInfoSection}_graded`][this.state.questionInfoIndex]}
        question={this.state[`${this.state.questionInfoSection}_questions`][this.state.questionInfoIndex]}
        changeGradedQuestion={this.changeGradedQuestion.bind(this)}
        isFloating={this.props.testViewMode}
      />
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
          compactMode={this.props.testViewMode}
          handleShowAnswer={this.handleShowAnswer.bind(this)}
          rerenderIndex={this.props.rerenderIndex}
        />
      )}
      <ScoreSummary
        reading_correct={this.state.reading_correct}
        writing_correct={this.state.writing_correct}
        math_no_calc_correct={this.state.math_no_calc_correct}
        math_calc_correct={this.state.math_calc_correct}
        reading_questions={this.state.reading_questions}
        writing_questions={this.state.writing_questions}
        math_no_calc_questions={this.state.math_no_calc_questions}
        math_calc_questions={this.state.math_calc_questions}
        weightedMath={mathSectionWeighted}
        weightedEnglish={englishSectionWeighted}
        weightedOverall={overallWeighted}
        allQuestions={this.state.allQuestions}
        isFloating={this.props.testViewMode}
        forceRerender={this.state.justRerendered}
        pressedGradeButtonIndex={this.state.pressedGradeButtonIndex}
        rerenderIndex={this.props.rerenderIndex}
      />
      <div className='grade-footer-aligner' style={{textAlign: 'right'}}>
        <button type='button' className='grade-button btn' disabled={this.state.graded}
          onClick={() => {
            this.changeGradedTest();
          }} 
        >
          <span className='fas fa-edit' /> Grade Test
        </button>
      </div>
      <Modal show={this.state.showBlankAnswersModal} onHide={() => this.setState({showBlankAnswersModal: false})}>
        <Modal.Header closeButton>
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
  }

}

Grade.propTypes = {
  test: PropTypes.string,
  numColumns: PropTypes.number,
  testViewMode: PropTypes.bool,
  thirdPartyMode: PropTypes.bool,
  rerenderIndex: PropTypes.number
}

Grade.defaultProps = {
  numColumns: 3,
  testViewMode: false,
  rerenderIndex: 0
}