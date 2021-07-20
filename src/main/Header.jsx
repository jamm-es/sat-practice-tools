import React from 'react';
import './header.css';

export default class Footer extends React.Component {

  render() {
    return (
      <header>
        <nav className='navbar navbar-expand-md'>
          <a className='navbar-brand nav-link' href='/'><span className='restricted'>SAT</span> Practice Tools</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="navbar-nav collapse navbar-collapse d-flex justify-content-end">
            <li className="nav-item active">
              <a className="nav-link" href="/">First</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Second</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Third</a>
            </li>
          </ul>
        </nav>
      </header>
    )
  }
}