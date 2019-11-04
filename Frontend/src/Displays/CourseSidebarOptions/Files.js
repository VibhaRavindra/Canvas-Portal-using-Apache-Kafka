import React, { Component } from 'react';
import { Redirect,Link } from "react-router-dom";
import Navigation from './../Navigation';
import './../../App.css';
import CourseSideBar from '../CourseSideBar'
import ReactPaginate from 'react-paginate';
import { connect } from "react-redux";
import { getCourseDetails } from "../../js/actions/actions";

function mapStateToProps(state) {
    return {courseDetails:state.courseDetails}
}

function mapDispatchToProps(dispatch) {
    return {
        getCourseDetails: (courseid) => dispatch(getCourseDetails(courseid))
    };
}

class Files extends Component {
    constructor(props){
        super();
        this.state = {
            searchString:"",
            addClicked:false,
            isStudent:localStorage.getItem("role") === "student",
            file:null,
            // For Pagination
            all_files:[],
            searched_files:[],
            files:[],
            files_per_page: 3,
            num_pages:0
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
        this.addClickHandler = this.addClickHandler.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.setFile = this.setFile.bind(this);
        this.getFiles = this.getFiles.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    handlePageClick(data){
        console.log(data.selected)
        let page_number = data.selected;
        let offset = Math.ceil(page_number * this.state.files_per_page)
        this.setState({
            files : this.state.searched_files.slice(offset, offset +this.state.files_per_page)
        })
    }
    searchChangeHandler(e){
        const ss = e.target.value;
        let searched_files = []
        this.state.all_files.forEach((file)=>{
            if(file.filename.toUpperCase().includes(ss.toUpperCase())) {
                searched_files.push(file)
            }
        })
        const pages = Math.ceil(searched_files.length/this.state.files_per_page)
        this.setState({
            searchString:e.target.value,
            searched_files: searched_files,
            num_pages: pages,
            files: searched_files.slice(0, this.state.files_per_page)
        })
    }

    setFile(e){
        console.log(e.target.files[0])
        this.setState({file:e.target.files[0]});
    }
    async uploadFile(e){
        e.preventDefault()
        const formdata = new FormData();
        formdata.append('file',this.state.file, this.state.file.name)
        let subResponse = await fetch("/uploadFile/"+this.props.match.params.courseid, {
            method:'POST',
            body:formdata,
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const subJson = await subResponse.json();
        if(subJson.success) {
            alert("Submission successful")
            this.getFiles();
        } else {
            alert("Submission failed")
        }
    }
    addClickHandler(){
        this.setState({addClicked:true})
    }

    async componentDidMount(){
        this.props.getCourseDetails(this.props.match.params.courseid)
        this.getFiles();
    }
    async getFiles(){
        const fileDetails = await fetch('/getFiles/'+ 
        this.props.match.params.courseid, {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const fileJson = await fileDetails.json();
        const pages = Math.ceil(fileJson.files.length/this.state.files_per_page)
        this.setState({
            all_files: fileJson.files,
            searched_files:fileJson.files,
            searchString:"",
            files: fileJson.files.slice(0,this.state.files_per_page),
            num_pages: pages,
            addClicked:false
        });
    }
   
    render(){
        const courseid  =this.props.match.params.courseid
        let header = <p className="dash-header-blue">Files for Course</p>
        let content;
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/files"}>
            Files
            </Link></p>
            let addFile=null
            if(!this.state.isStudent){
                addFile = <button className="btn btn-primary" onClick={this.addClickHandler}>Add File</button>
            }
            let uploadForm = null;
            if(this.state.addClicked){
                uploadForm = <div><form onSubmit={this.uploadFile}>
                    <div class="form-group">
                    <label for="fileupload">Select File</label>
                    <input required onChange={this.setFile} type="file" className="form-control-file" accept="application/pdf" name="submissionfile"/></div>
                    <button type="submit" className="btn btn-primary">Upload File</button>
                </form></div>
            }
            if (this.state.files.length > 0){
                let tableRows = this.state.files.map(
                    (file) =>{
                        
                            return(
                                <tr>
                                    <td><a target="_blank" href={"/viewfile/"+file.fileid+"/file"}>{file.filename}</a></td>
                                    <td>{file.uploaded_timestamp}</td>
                                    <td>{file.user_name}</td>
                                    <td>{file.size}</td>
                                </tr>
                            )
                    }
                );
                let addFile=null
                if(!this.state.isStudent){
                    addFile = <button className="custom-button-2 addAnnounce-button" onClick={this.addClickHandler}>Add File</button>
                }
                let uploadForm = null;
                if(this.state.addClicked){
                    uploadForm = <div><form onSubmit={this.uploadFile}>
                        <div class="form-group">
                        <label for="fileupload">Select File</label>
                        <input required onChange={this.setFile} type="file" className="form-control-file" accept="application/pdf" name="submissionfile"/></div>
                        <button type="submit" className="btn btn-primary">Upload File</button>
                    </form></div>
                }
                content = <div className="course-content-wrapper">
                <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search Files"/>
                {addFile}
                {uploadForm}
                <table className="table table-striped custom-table2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date Created</th>
                        <th>Created By</th>
                        <th>Size</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
                </table>
                <div className="row">
                            <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.num_pages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            />
                        </div>
                </div>

            } else{
                content = <div className="course-content-wrapper">
                <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search Files"/>
                {addFile}
                {uploadForm}
                <div className="noContent"><div className="sub-noContent"><p>You do not have any files posted for this course.</p></div></div>
                </div>
            }
        }
        return( 
            <div className="main-wrapper">
                <Navigation></Navigation>
                <div className="content-wrapper">
                    <div className="dash-one">
                    {header}
                    </div>
                    <div className="course-main-wrapper">
                        <div className="clearfix"></div>
                        <CourseSideBar parent="Files" coursepath={"/courses/"+courseid} isStudent={this.state.isStudent}></CourseSideBar>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Files);