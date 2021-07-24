import React from 'react';
import PropTypes from 'prop-types';

import './score-summary.css';
import './footer.css';

export default class ScoreSummary extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      isCollapsed: this.props.isFloating
    }
  }

  shouldComponentUpdate(_, nextState) {
    return this.state.isCollapsed !== nextState.isCollapsed || !nextState.isCollapsed;
  }

  render() {
    return <div className={this.props.isFloating ? `score-summary-floating` : ''}>
      <div className='score-summary-tab' onClick={() => this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }))}>
        <div className='score-summary-tab-left'></div>
        <div className='score-summary-tab-title'>Score Summary</div>
        <div className='score-summary-tab-right'></div>
      </div>
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
      </div>
    </div>
  }

}

ScoreSummary.propTypes = {
  reading_correct: PropTypes.array,
  writing_correct: PropTypes.array, 
  math_no_calc_correct: PropTypes.array,
  math_calc_correct: PropTypes.array,
  weightedMath: PropTypes.string,
  weightedEnglish: PropTypes.string,
  weightedOverall: PropTypes.string,
  isFloating: PropTypes.bool
}