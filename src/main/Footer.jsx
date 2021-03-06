import React from 'react';
import './footer.css';

export default class Footer extends React.Component {

  render() {
    return (
      <footer>
        <p>Other websites:</p>
        <p><a href='https://collegespamguard.com'>CollegeSpamGuard.com</a> - filter out unwanted college spam from your email inbox</p>
        <p><a href='https://wordlestat.com'>WordleStat.com</a> - view letter guess distributions and win rates for each day's Wordle.</p>
        <br />
        <p>Email us: <a href="mailto:satpracticetools@gmail.com">SATPracticeTools@gmail.com</a></p> 
        <br />
        <p>Copyright &copy; 2021 SATPractice.tools</p>
        <p>SAT&reg; is a trademark registered by the College Board, which is not affiliated with, and does not endorse, SATPractice.tools</p>
      </footer>
    )
  }
}