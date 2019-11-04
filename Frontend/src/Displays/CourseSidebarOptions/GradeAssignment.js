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
class GradeAssignment extends Component {
    constructor(props){
        super();
        this.state = {
            isLoggedIn: true,
            isStudent:false,
            submissions:[],
            searchString:""
        }
        this.getSubmissions = this.getSubmissions.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
        this.updateGrade  =this.updateGrade.bind(this)
    }
    async updateGrade(e){
        e.preventDefault()
        const data = new FormData(e.target)
        const updateGrade = await fetch('/updateGrade',{
            method: 'POST',
            body:data,
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const updateGradeRes = await updateGrade.json();
        if(!updateGradeRes.success){
            alert("Grade update failed");
        } else {
            alert("Grade updated");
        }
    }
    searchChangeHandler(e){
        this.setState({searchString:e.target.value})
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
        const subDetails = await fetch('/getAllSubmissions/'+this.props.match.params.assignid, {
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
        if (this.state.isStudent) {
            return(<Redirect to={"/courses/"+courseid+"/assignments"}/>)
        }
        
        let header = <p className="dash-header">Assignment Submission</p>
        let content = <h1>Grade Assignment Submissions for course {courseid}</h1>
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null && this.state.assignDetails !=null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/assignments"}>
            Assignments
            </Link> > <Link to={"/courses/"+courseid+"/assignments/"+this.props.match.params.assignid}>
            {this.state.assignDetails.name}
            </Link></p>
            let tableRows = this.state.submissions.map(
                (assign) =>{
                    if(assign.user_name.toUpperCase().includes(this.state.searchString.toUpperCase())){
                    return <tr>
                        <td>{assign.user_name}</td>
                        <td><a target="_blank" href={"/viewfile/"+assign.localfilename+"/grading"}>{assign.user_filename}</a></td>
                        <td>{assign.timestamp}</td>
                        <td><form onSubmit={this.updateGrade}
                    >
                    <input type="hidden" name="studentid" value={assign.student_id}/>
                    <input type="hidden" name="assignid" value={this.props.match.params.assignid}/><input type="number" min="0" placeholder={assign.grade} name="grade"/><button type="submit" className="btn btn-primary">Save Grade</button></form></td>
                    </tr>;
                    } else {
                        return null;
                    }
                }
            );
            content = <div className="course-content-wrapper">
            <input type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search Assignments"/>
            <h4 className="width55">{this.state.assignDetails.name}</h4>
            <p>{this.state.assignDetails.points} pts</p>
            <p></p>
            <table className="table table-striped">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Assignment File</th>
                    <th>Submission time</th>
                    <th>Grade</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
            </table>
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
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (GradeAssignment);