import React, { Component } from 'react';
import {Link } from "react-router-dom";
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
class Assignments extends Component {
    constructor(props){
        super();
        this.state = {
            courses: [],
            isLoggedIn: true,
            isStudent:localStorage.getItem("role") === "student",
            courseDetails:null,
            searchString:"",
            assignments:[]
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }
    searchChangeHandler(e){
        this.setState({searchString:e.target.value})
    }
    async componentDidMount(){
        this.props.getCourseDetails(this.props.match.params.courseid)

        const assignDetails = await fetch('/getAssignments/'+ 
        this.props.match.params.courseid, {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const assignObj = await assignDetails.json();
        this.setState({
            assignments: assignObj.assignments
        });
    }
   
    render(){
        const courseid  =this.props.match.params.courseid
        let header = <p className="dash-header-blue">IndividualCourse</p>
        let content;
        const cd = this.props.courseDetails;
        let nextPage ="assignments"
        if(!this.state.isStudent)
            nextPage ="gradeassignments"
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/assignments"}>
            Assignments
            </Link> </p>
            let addAssignment=null
            if(!this.state.isStudent){
                addAssignment = <Link to={"/courses/"+courseid+"/addassignment"}><button className="btn btn-primary">Add Assignment</button></Link>
            }
            if (this.state.assignments.length>0){
                let tableRows = this.state.assignments.map(
                    (assign) =>{
                        if(assign.name.toUpperCase().includes(this.state.searchString.toUpperCase())){
                            return(
                            <div className="one-quiz-contain">
                                <Link to={"/courses/"+courseid+"/"+nextPage+"/"+assign.id}>
                                <div className="quiz-name">{assign.name}</div>
                                <div className="second-row">
                                    <span className="second-row-span"> -/{assign.points} Points</span>
                                </div>
                                </Link>
                            </div>
                            )    
                        } else {
                            return null;
                        }
                    }
                );
                
                content = <div className="course-content-wrapper">
                <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search for Assignment"/>
                {addAssignment}
                <div className="quiz-collection-container">
                    {tableRows}
                </div>
                </div>
            } else{
                content = <div className="course-content-wrapper">
                <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search for Assignment"/>
                {addAssignment}
                <div className="noContent"><div className="sub-noContent"><p>No assignments have been posted for this course.</p></div></div>
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
                        <CourseSideBar parent="Assignments" coursepath={"/courses/"+courseid} isStudent={this.state.isStudent}></CourseSideBar>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Assignments);