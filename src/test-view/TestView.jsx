import React from 'react';
import PropTypes from 'prop-types';

import {Grade} from '../grade';
import {default as PDFViewer} from './PDFViewer';

import './test-view.css';

export default class TestView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pdfPath: ''
    }
  }

  componentDidMount() {
    import(`../data/pdfs/${this.props.test}.pdf`)
      .then(pdfPath => {
        console.log(pdfPath);
        this.setState({ pdfPath: pdfPath.default });
      });
  }

  render() {
    return (
      <div className='test-view-container'>
        <div className='test-view-pdf'>
          <PDFViewer pdfPath={this.state.pdfPath} />
        </div>
        <div className='overflow-auto test-view-grade'>
          <Grade test={this.props.test} numColumns={1} compactMode />
        </div>
      </div>
    )
  }

}

Grade.propTypes = {
  test: PropTypes.string,
}