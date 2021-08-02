import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import Helmet from 'react-helmet';

import {Grade} from '../grade';
import {default as PDFViewer} from './PDFViewer';

import testUrls from '../data/test-urls.json';
import practiceTests from '../data/practice-tests.json';

import './test-view.css';
export default class TestView extends React.Component {

  constructor(props) {
    super(props);

    this.isPastTest = !practiceTests.some(d => d.replaceAll(' ', '-').toLowerCase() === this.props.test);

    this.embeddableHostnames = [
      'docdroid.net',
      'web.archive.org',
      'maine.gov',
      'drive.google.com'
    ];

    this.uploadRef = React.createRef();
    this.gradeViewCollapseIcon = React.createRef();
    this.gradeViewCollapseContainer = React.createRef();
    this.testViewContainerRef = React.createRef();
    this.pdfRef = React.createRef();

    this.state = {
      pdfPath: this.isPastTest ? '' : testUrls[this.props.test][0],
      thirdPartyPath: '',
      rerenderIndex: 0,
      windowWidth: 0
    }
    if(this.isPastTest) {
      for(let i = 0; i < testUrls[this.props.test].length; ++i) {
        this.state[`${i}_status`] = false; // indicates if load has failed
      }
    }
  }

  componentDidMount() {
    this.setWidth();
    window.addEventListener('resize', this.setWidth.bind(this)); 
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setWidth.bind(this)); 
  }

  setWidth() {
    this.setState({ windowWidth: window.innerWidth });
  }

  handleUploadedFile(e) {
    this.setState(prevState => ({ 
      thirdPartyPath: URL.createObjectURL(e.target.files[0]),
      rerenderIndex: prevState.rerenderIndex+1
    }));
  }

  // from https://stackoverflow.com/questions/4878756/how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
  toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }).replaceAll('Us', 'US');
  }

  handleGradeViewToggle() {
    if(this.state.windowWidth <= 700) {
      if(!this.gradeViewCollapseContainer.current.classList.contains('test-view-grade-hide-children')) {
        this.gradeViewCollapseContainer.current.classList.add('test-view-grade-hide-children');
  
        this.gradeViewCollapseIcon.current.classList.remove('fa-chevron-right');
        this.gradeViewCollapseIcon.current.classList.add('fa-chevron-left');
  
        this.testViewContainerRef.current.classList.add('test-view-container-expanded');
        this.testViewContainerRef.current.classList.remove('test-view-container-grade-only');

        this.pdfRef.current.classList.add('show');
      }
      else {
        this.gradeViewCollapseContainer.current.classList.remove('test-view-grade-hide-children');
  
        this.gradeViewCollapseIcon.current.classList.add('fa-chevron-right');
        this.gradeViewCollapseIcon.current.classList.remove('fa-chevron-left');
  
        this.testViewContainerRef.current.classList.remove('test-view-container-expanded');
        this.testViewContainerRef.current.classList.add('test-view-container-grade-only');

        this.pdfRef.current.classList.remove('show');
      }
    }
    else {
      if(!this.gradeViewCollapseContainer.current.classList.contains('test-view-grade-hide-children')) {
        this.gradeViewCollapseContainer.current.classList.add('test-view-grade-hide-children');
  
        this.gradeViewCollapseIcon.current.classList.remove('fa-chevron-right');
        this.gradeViewCollapseIcon.current.classList.add('fa-chevron-left');
  
        this.testViewContainerRef.current.classList.add('test-view-container-expanded')
      }
      else {
        this.gradeViewCollapseContainer.current.classList.remove('test-view-grade-hide-children');
  
        this.gradeViewCollapseIcon.current.classList.add('fa-chevron-right');
        this.gradeViewCollapseIcon.current.classList.remove('fa-chevron-left');
  
        this.testViewContainerRef.current.classList.remove('test-view-container-expanded')
      }
    }
  }

  render() {    
    const testTitle = this.toTitleCase(this.props.test.replaceAll('-', ' '));
    return (
      <div className={`test-view-container ${!this.props.isTestMode ? 'grade-view' : ''} ${this.state.windowWidth <= 700 ? 'test-view-container-expanded' : ''}`} ref={this.testViewContainerRef}>
        <Helmet>
          <title>SAT {testTitle}{this.isPastTest ? ' | Past Exam' : ''}</title>
          <meta 
            name='description'
            content={`Easily take and grade the SAT ${testTitle} online, and other free, official practice tests and past exams. Measure your skills and view explanations of questions you're confused about.`}
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
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "${this.props.isTestMode ? 'Test' : 'Grade'}",
                "item": "https://satpractice.tools/${this.props.test}/${this.props.isTestMode ? 'test' : 'grade'}"
              }
            ]
          }
        `}</script>
        </Helmet>
        {this.props.isTestMode && <div className='test-view-pdf collapse show' ref={this.pdfRef}>
          {
            this.state.thirdPartyPath !== ''
            ? <div className='test-view-third-party-wrapper'>

              <div className='test-view-button-container'>
                {
                  this.state.windowWidth > 1100
                  ? <>
                    {
                      testUrls[this.props.test].map((url, i) => 
                        <Button 
                          variant='main' 
                          key={i}
                          disabled={url === this.state.thirdPartyPath}
                          onClick={() => this.setState(prevState => ({ thirdPartyPath: url, rerenderIndex: prevState.rerenderIndex+1 }))}
                        >
                          Link {i+1}{i === 0 ? ' (preferred)' : ''} ({new URL(url).hostname})
                        </Button>
                      )
                    }
                    <Button
                      variant='main'
                      onClick={() => this.setState(prevState => ({ thirdPartyPath: '', rerenderIndex: prevState.rerenderIndex+1 }))}
                    >
                      Return to Disclaimer
                    </Button>
                  </>
                  : <>
                    {
                      testUrls[this.props.test].map((url, i) => 
                        this.state.thirdPartyPath !== url
                          ? <a 
                            key={i}
                            onClick={() => this.setState(prevState => ({ thirdPartyPath: url, rerenderIndex: prevState.rerenderIndex+1 }))}
                          >
                            Link {i+1}{i === 0 ? ' (preferred)' : ''} ({new URL(url).hostname})
                          </a>
                          : <></>
                      )
                    }
                    <a
                      variant='main'
                      onClick={() => this.setState(prevState => ({ thirdPartyPath: '', rerenderIndex: prevState.rerenderIndex+1 }))}
                    >
                      Return to Disclaimer
                    </a>
                  </>
                }
              </div>

              {
                this.embeddableHostnames.includes(new URL(this.state.thirdPartyPath).hostname)
                ? <iframe src={this.state.thirdPartyPath} />
                : this.state.thirdPartyPath.substring(0, 5) === 'blob:'
                ? <iframe src={this.state.thirdPartyPath} type='application/pdf'></iframe>
                : <div className='d-flex justify-content-center align-items-center'>
                  <div style={{width: '50%'}}>
                    <p>We cannot directly embed this PDF.</p>
                    <p>If you click the button to externally download the file, you can re-upload it to display side-by-side on this page.</p>
                    <div className='test-view-button-container' style={{marginTop: 20}}>
                      <a href={this.state.thirdPartyPath} target='_blank'><Button variant='main'>Download Test</Button></a>
                      <div>
                        <input ref={this.uploadRef} style={{display: 'none'}} type='file' accept='.pdf' onChange={this.handleUploadedFile.bind(this)}/>
                        <Button onClick={() => this.uploadRef.current.click() } variant='main'>
                          Re-upload and Display
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
            : this.isPastTest
            ? <div className='test-view-old-wrapper'>
              <p>Because this is not an official practice test, we are unable to host the test directly.</p>
              <p>Instead, you may attempt to load a test from a third-party source:</p>
              <div className='test-view-button-container' style={{margin: '20px 0'}}>
                {
                  this.state.windowWidth > 1100
                    ? testUrls[this.props.test].map((url, i) => <Button 
                      variant='main' 
                      key={i}
                      onClick={() => this.setState(prevState => ({ thirdPartyPath: url, rerenderIndex: prevState.rerenderIndex+1 }))}
                    >
                      Link {i+1}{i === 0 ? ' (preferred)' : ''} ({new URL(url).hostname})
                    </Button>)
                    : testUrls[this.props.test].map((url, i) => <a
                      key={i}
                      onClick={() => this.setState(prevState => ({ thirdPartyPath: url, rerenderIndex: prevState.rerenderIndex+1 }))}
                    >
                      Link {i+1}{i === 0 ? ' (preferred)' : ''} ({new URL(url).hostname})
                    </a>)
                }
              </div>
              <Alert variant='danger'>
                SATPractice.tools does NOT host or publish any unreleased exams. SATPractice.tools is not liable for third-party content this website links to.
              </Alert>
            </div>
            : <PDFViewer pdfPath={this.state.pdfPath} />

          }
        </div>}
        <div className='test-view-grade'>
          {!this.props.isTestMode && <h1>SAT {testTitle}{this.isPastTest && ' (Past Exam)'}</h1>}
          {
            this.props.isTestMode && <>
              <div className='test-view-grade-collapser' onClick={this.handleGradeViewToggle.bind(this)}>
                <div className='test-view-grade-tab-upper'/>
                <div className='test-view-grade-tab'>
                  <span className={`fas ${this.state.windowWidth <= 700 ? 'fa-chevron-left' : 'fa-chevron-right'}`} ref={this.gradeViewCollapseIcon}/>
                </div>
                <div className='test-view-grade-tab-lower'/>
              </div>
              <div className='test-view-grade-collapser-edge' onClick={this.handleGradeViewToggle.bind(this)}/>
            </>
          }
          <div className={`test-view-grade-container ${this.state.windowWidth <= 700 ? 'test-view-grade-hide-children' : ''}`} ref={this.gradeViewCollapseContainer}>
            <Grade 
              test={this.props.test} 
              thirdPartyMode={this.isPastTest}
              numColumns={this.props.isTestMode ? 1 : 3} 
              testViewMode={this.props.isTestMode}
              rerenderIndex={this.state.rerenderIndex}
              windowWidth={this.state.windowWidth}
            />
          </div>
        </div>
        <div className='test-view-change-button'>
          <Link to={`/${this.props.test}/${this.props.isTestMode ? 'grade' : 'test'}`}>
            <Button variant='main' onClick={() => this.setState(prevState => ({ rerenderIndex: prevState.rerenderIndex+1 }))}>
              {this.props.isTestMode ? 'Remove Test View' : 'View Test Side-by-side'}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

}

TestView.propTypes = {
  test: PropTypes.string,
  isPastTest: PropTypes.bool,
  isTestMode: PropTypes.bool
}