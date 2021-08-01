import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import './header.css';

export default class Footer extends React.Component {

  constructor(props) {
    super(props);

    this.backgroundRef = React.createRef();
  }

  handleBackgroundToggle() {
    if(this.backgroundRef.current.classList.contains('show')) {
      this.backgroundRef.current.classList.remove('show');
    }
    else {
      this.backgroundRef.current.classList.add('show');
    }
  }

  render() {
    return (
      <>
        <header>
          <Navbar expand='md'>
            <Navbar.Brand href="/">SAT Practice Tools</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" children={<span className='fas fa-bars' />} onClick={this.handleBackgroundToggle.bind(this)} />
            <Navbar.Collapse className='justify-content-end'>
              <Nav className="me-auto" className='justify-content-end'>
                <Nav.Link href="/test">Take Tests</Nav.Link>
                <Nav.Link href="/grade">Grade Tests</Nav.Link>
                <Nav.Link href="/list">All Tests</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>
        <div className='header-dark-background collapse' ref={this.backgroundRef} />
      </>
    )
  }
}