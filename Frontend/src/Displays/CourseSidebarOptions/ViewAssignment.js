import React, { Component } from 'react';
import { Redirect,Link } from "react-router-dom";
import Navigation from './../Navigation';
import './../../App.css';
import CourseSideBar from '../CourseSideBar'
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
class ViewAssignment extends Component {
    constructor(props){
        super();
        this.state = {
            isLoggedIn: true,
            isStudent:localStorage.getItem("role") === "student",
            submissions:[],
            submitClicked:false,
            submissionfile:null,
            assignDetails:{}
        }
        this.submitClickHandler = this.submitClickHandler.bind(this);
        this.uploadSubmission = this.uploadSubmission.bind(this);
        this.setFile = this.setFile.bind(this);
        this.downloadAssignment = this.downloadAssignment.bind(this);
        this.getSubmissions = this.getSubmissions.bind(this);
    }
    async downloadAssignment(e){
        e.preventDefault();
        await fetch(e.target.href,{
            method:'GET',
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        });
    }
    setFile(e){
        console.log(e.target.files[0])
        this.setState({submissionfile:e.target.files[0]});
    }
    async uploadSubmission(e){
        e.preventDefault()
        const formdata = new FormData();
        formdata.append('submissionfile',this.state.submissionfile, this.state.submissionfile.name)
        console.log(formdata);
        console.log(this.state.submissionfile.name)
        let subResponse = await fetch("/submitAssignment/"+this.props.match.params.assignid+"/"+localStorage.getItem("userid"), {
            method:'POST',
            body:formdata,
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const subJson = await subResponse.json();
        if(subJson.success) {
            alert("Submission successful")
            this.getSubmissions();
        } else {
            alert("Submission failed")
        }
    }
    submitClickHandler(){
        this.setState({submitClicked:true})
    }
    async componentDidMount(){
        
        this.props.getCourseDetails(this.props.match.params.courseid)

        const getAssignDetails = await fetch('/getAssignDetails/'+ 
        this.props.match.params.assignid, {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const assignDetails = await getAssignDetails.json();
        this.setState({
            assignDetails: assignDetails
        });

        this.getSubmissions();
    }

    async getSubmissions(){
        const subDetails = await fetch('/getSubmissions/'+ 
        this.props.match.params.courseid+"/"+this.props.match.params.assignid+"/"+localStorage.getItem("userid"), {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const subObj = await subDetails.json();
        this.setState({
            submissions: subObj.submissions
        });
    }
   
    render(){
        const courseid  =this.props.match.params.courseid
        if (!this.state.isStudent) {
            return(<Redirect to={"/courses/"+courseid+"/assignments"}/>)
        }
        
        let header = <p className="dash-header-blue">Assignment Submission</p>
        let content = <h1>Assignment Submissions for course {courseid}</h1>
        const cd = this.props.courseDetails;
        let uploadForm = null;
        if(this.state.submitClicked){
            uploadForm = <div><form onSubmit={this.uploadSubmission}>
                <div class="form-group">
                {/* <label for="fileupload">Select Assignment File</label> */}
                <input  onChange={this.setFile} type="file" className="form-control-file" accept="application/pdf" name="submissionfile"/></div>
                <button type="submit" className="custom-button-2">Upload Assignment</button>
            </form></div>
        }
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/assignments"}>
            Assignments
            </Link> > <Link to={"/courses/"+courseid+"/assignments/"+this.props.match.params.assignid}>
            {this.state.assignDetails.name}
            </Link></p>
            let tableRows = this.state.submissions.map(
                (assign) =>{
                    return <tr>
                    <td><a target="_blank" href={"/viewfile/"+assign.submission_id+"/assign"}>{assign.userfilename}</a></td>
                        <td>{assign.timestamp}</td>
                    </tr>;
                }
            );
            content = <div>
                <div className="row padding-top20 padding-bottom20">
                    <h4 className="width55">{this.state.assignDetails.name}</h4>
                    <button className="custom-button-2" data-toggle="modal" data-target="#myModal" onClick={this.submitClickHandler}>Submit Assignment</button>
                </div>
                <div className="row">
                    <ul id="quiz-top">
                        <li>
                            <span className="span-heading">Due</span> 
                            <span className="span-value">No Due Date</span>
                        </li>
                        <li>
                            <span className="span-heading">Points</span> 
                            <span className="span-value">{this.state.assignDetails.points}</span>
                        </li>
                        <li>
                            <span className="span-heading">Submitting</span> 
                            <span className="span-value">file Upload</span>
                        </li>
                    </ul>
                </div>
                <div class="modal fade" id="myModal" role="dialog">
                    <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h4 class="modal-title">Select Assignment File</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                        {uploadForm}
                        </div>
                        <div class="modal-footer">
                        </div>
                    </div>
                    </div>
                </div>


                <div className="row">
                    <table className="custom-table1 table width70">
                    <thead>
                        <tr>
                            <th>View Submission</th>
                            <th>Submission Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                    </table>
                </div>
                
                </div>
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
                        <CourseSideBar coursepath={"/courses/"+courseid} isStudent={this.state.isStudent}></CourseSideBar>
                        {content}
                        {/* {uploadForm} */}
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewAssignment);
