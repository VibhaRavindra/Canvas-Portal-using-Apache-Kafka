import React, { Component } from "react";
import { Document, Page,pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PDFView extends Component {
  state = { numPages: null, pageNumber: 1 ,
  pdf:''};

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  async componentDidMount(){
    let id = this.props.match.params.fileid
    let type = this.props.match.params.type
    
    if(type === "file") {
      let fileResponse = await fetch("/getFile/"+id, {
        method:'GET',
        headers:{
          'Authorization': "bearer " + localStorage.getItem("jwtToken")
        }
    })
    const fileJson = await fileResponse.json();
    this.setState({pdf:fileJson.pdf})
    } else if(type==="grading"){
      let fileResponse = await fetch("/getGradingFile/"+id, {
        method:'GET',
        headers:{
          'Authorization': "bearer " + localStorage.getItem("jwtToken")
        }
    })
    const fileJson = await fileResponse.json();
    this.setState({pdf:fileJson.pdf})
    }else {
      let userid = localStorage.getItem("userid")
      if(this.props.match.params.studentid && localStorage.getItem("role") ==="faculty") {
        userid = this.props.match.params.studentid
      }
      let fileResponse = await fetch("/getSubmissionFile/"+id+"/"+userid, {
        method:'GET',
        headers:{
          'Authorization': "bearer " + localStorage.getItem("jwtToken")
        }
    })
    const fileJson = await fileResponse.json();
    this.setState({pdf:fileJson.pdf})
    }
  }

  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
        <nav>
          <button onClick={this.goToPrevPage}>Prev</button>
          <button onClick={this.goToNextPage}>Next</button>
        </nav>

        <div style={{ width: 600 }}>
          <Document
            file={this.state.pdf}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} width={600} />
          </Document>
        </div>

        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    );
  }
}
export default PDFView;