import React from 'react';
import Alert from 'react-bootstrap/Alert';
import {Helmet} from 'react-helmet';

import './generic_page.css';

export default class About extends React.Component {

  render() {
    return <div>
      <Helmet>
        <title>About</title>
      </Helmet>
      <h1>About</h1>
      <p>SATPractice.tools was created in 2021 to help others study more efficiently for the SATs.</p>
      <p>This website serves as an easy place to find practice tests to take and grade.</p>
      <p>The convenient web view allows students to easily view answer explanations, determine which skillsets they need to work on, and calculate their
        hypothetical weighted final score, along with a host of other convenient features.
      </p>
      <p>If you want to get in contact with us, simply email us here: <a href='mailto:SATPracticeTools@gmail.com'>SATPracticeTools@gmail.com</a></p>
      <Alert variant='danger' style={{marginTop: 20}}>
        <Alert.Heading>Disclaimers</Alert.Heading>
        <p>SATPractice.tools is in no way affiliated with the SATs or the College Board.</p>
        <p>This website does not own the trademark for SAT, not does it own the content of test documents, questions, answers, answer explanations, grading curves, or
          other information specific to each test.</p>
        <p>This website does own the source code that allows aforementioned content to be accessed conveniently by students.</p>
        <p>This content is used under Fair Use as defined by Section 107 of the Copyright Act of 1976. Under said act, use of copyrighted material
           is permissible for purposes such as criticism, comment, news reporting, teaching, scholarship, education and research.
        </p>
        <p>This website is not responsible for any third-party content it links to. Any such third-party content is clearly indicated as such,
          and is in no way affiliated with this website or its owners.
        </p>
      </Alert>
      
    </div>
  }

}