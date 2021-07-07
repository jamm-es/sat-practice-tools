import React from 'react';
import './not-found.css';

export default class Home extends React.Component {

  render() {
    return (
      <div className='not-found'>
        <h1>Page Not Found</h1>
        <p><a href='/'>Return to home</a></p>
      </div>
    );
  }

}

