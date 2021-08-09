import React from 'react';
import PropTypes from 'prop-types';
import PDFObject from 'pdfobject';

import './pdf-viewer.css';
export default class PDFViewer extends React.Component {

  constructor(props) {
    super(props);
    
    this.options = {
      fallbackLink: `Your browser can't view embedded PDFs. <a href='[url]'>Download the test</a> to view it.`,
      suppressConsole: true,
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.pdfPath !== nextProps.pdfPath;
  }

  componentDidMount() {
    PDFObject.embed(this.props.pdfPath, `#pdf-viewer`, this.options);
  }

  componentDidUpdate() {
    PDFObject.embed(this.props.pdfPath, `#pdf-viewer`, this.options);
  }

  render() {
    return <div style={{ width: this.props.width, height: this.props.height }}className='pdf-viewer-container'>
      <div style={{ width: '100%', height: '100%' }} id='pdf-viewer' ref={this.pdfViewerIFrameContainerRef}>

      </div>
    </div>;
  }

}

PDFViewer.propTypes = {
  pdfPath: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

PDFViewer.defaultProps = {
  width: '100%',
  height: '100%',
};