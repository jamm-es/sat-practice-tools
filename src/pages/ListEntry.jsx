import React from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import pastTests from '../data/past-tests.json';
import testUrls from '../data/test-urls.json';

import './generic_page.css';

export default class ListEntry extends React.Component {

  // from https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }).replaceAll('Us', 'US');
  }

  render() {
    const testTitle = this.toTitleCase(this.props.test.replaceAll('-', ' '));
    const isThirdParty = pastTests.includes(testTitle);

    return <div>
      <Helmet>
        <title>SAT {testTitle}</title>
        <meta 
          name='description'
          content={`Easily take and grade the SAT ${testTitle} online. Measure your skills and view explanations of questions you're confused about.`}
        />
        <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "SAT ${testTitle}",
              "item": "https://satpractice.tools/${this.props.test}"
            }
          ]
        }
      `}</script>
      </Helmet>
      <h1>SAT {testTitle}</h1>
      {
        !isThirdParty
        ? <>
          <p>This is an official practice test. This means that you will have full access to answer explanations and accurate score curves, along with
            skill breakdowns.
          </p>
        </>
        : <>
          <p>This is a past test. Although this is still a genuine SAT test and useful for practicing, answer explanations and skill breakdowns might be unavailable,
            and the score curve might be estimated.
          </p>
        </>
      }
      <p>Go to the following links to take the test online, or grade the test if you've already completed it on paper.</p>
      <div className='center-buttons'>
        <Link to={`${this.props.test}/test`}><Button variant='main'>Take Test Online</Button></Link>
        <Link to={`${this.props.test}/test`}><Button variant='main'>Grade Completed Test</Button></Link>
      </div>
      <p>If you just want to view the test, without being entering answers as you take it, try using the following links. Please note that, for third-party links,
        SATPractice.tools is not responsible for their content. All of the following content was uploading by third parties. As such, they may become unavailable at any
        time.
      </p>
      <ul>
        {testUrls[this.props.test].map((url, i) => <li><a target='_blank' href={url}>Link {i+1} {i === 0 && '(preferred) '}({new URL(url).hostname})</a></li>)}
      </ul>
    </div>
  }

}