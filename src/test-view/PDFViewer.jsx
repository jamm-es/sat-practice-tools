import React from 'react';
import PropTypes from 'prop-types';
import PDFObject from 'pdfobject';

/*
mostly from https://github.com/pipwerks/PDFObject/issues/120#issuecomment-283593203
*/

export default class PDFViewer extends React.Component {

  shouldComponentUpdate(nextProps) {
    return this.props.pdfPath !== nextProps.pdfPath;
  }

  render() {
    console.log('rendered pdfviewer');
    console.log(this.props.pdfPath)
    const options = {
      fallbackLink: `Your browser can't view embedded PDFs. <a href='[url]'>Download the test</a> to view it.`,
      suppressConsole: true
    };
    PDFObject.embed(this.props.pdfPath, `#${this.props.containerID}`, options);
    return <div style={{ width: this.props.width, height: this.props.height }} id={this.props.containerID} />;
  }

}

PDFViewer.propTypes = {
  pdfPath: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  containerID: PropTypes.string,
};

PDFViewer.defaultProps = {
  width: '100%',
  height: '100%',
  containerID: 'pdf-viewer',
};