import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';

import {Grade} from '../grade';
import {default as PDFViewer} from './PDFViewer';

import thirdPartyUrls from '../data/past-urls.json';
import practiceTests from '../data/practice-tests.json';

import './test-view.css';
export default class TestView extends React.Component {

  constructor(props) {
    super(props);

    this.isPastTest = !practiceTests.some(d => d.replaceAll(' ', '-').toLowerCase() === this.props.test);

    this.embeddableHostnames = ['docdroid.net'];

    this.uploadRef = React.createRef();

    this.state = {
      pdfPath: '',
      thirdPartyPath: '',
    }
    if(this.isPastTest) {
      for(let i = 0; i < thirdPartyUrls[this.props.test].length; ++i) {
        this.state[`${i}_status`] = false; // indicates if load has failed
      }
    }
  }

  componentDidMount() {
    if(!this.isPastTest) {
      import(`../data/pdfs/${this.props.test}.pdf`)
        .then(pdfPath => {
          this.setState({ pdfPath: pdfPath.default });
        });
    }
  }

  handleUploadedFile(e) {
    console.log(URL.createObjectURL(e.target.files[0]));
    console.log(e.target.files[0]);
    this.setState({ thirdPartyPath: URL.createObjectURL(e.target.files[0]) });
  }

  render() {
    return (
      <div className='test-view-container'>
        <div className='test-view-pdf'>
          {
            this.state.thirdPartyPath !== ''
            ? <div className='test-view-third-party-wrapper'>
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
              
              <div className='test-view-button-container'>
                {
                  thirdPartyUrls[this.props.test].map((url, i) => 
                    <Button 
                      variant='main' 
                      key={i}
                      disabled={url === this.state.thirdPartyPath}
                      onClick={() => this.setState({ thirdPartyPath: url })}
                    >
                      Link {i+1} ({new URL(url).hostname})
                    </Button>
                  )
                }
                <Button
                  variant='main'
                  onClick={() => this.setState({ thirdPartyPath: '' })}
                >
                  Return to Disclaimer
                </Button>
              </div>
            </div>
            : this.isPastTest
            ? <div className='test-view-old-wrapper'>
              <p>Because this is not an official practice test, we are unable to host the test directly.</p>
              <p>Instead, you may attempt to load a test from a third-party source:</p>
              <div className='test-view-button-container' style={{margin: '20px 0'}}>
                {
                  thirdPartyUrls[this.props.test].map((url, i) => 
                    <Button 
                      variant='main' 
                      key={i}
                      onClick={() => this.setState({ thirdPartyPath: url })}
                    >
                      Link {i+1} ({new URL(url).hostname})
                    </Button>
                  )
                }
              </div>
              <Alert variant='danger'>
                SATPractice.tools does NOT host or publish any unreleased exams. SATPractice.tools is not liable for third-party content this website links to.
              </Alert>
            </div>
            : <PDFViewer pdfPath={this.state.pdfPath} />

          }
        </div>
        <div className='overflow-auto test-view-grade'>
          <Grade 
            test={this.props.test} 
            thirdPartyMode={this.isPastTest}
            numColumns={1} 
            testViewMode 
          />
        </div>
      </div>
    )
  }

}

Grade.propTypes = {
  test: PropTypes.string,
  isPastTest: PropTypes.bool
}