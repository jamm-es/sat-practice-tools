import React from 'react';
import './footer.css';

export default class Footer extends React.Component {

  render() {
    return (
      <footer>
        <p><a href='/'>Homepage</a></p>
        <p>Email us: <a href="mailto:satpracticetools@gmail.com">SATPracticeTools@gmail.com</a></p> 
      </footer>
    )
  }
}