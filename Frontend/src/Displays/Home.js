import React, { Component } from 'react';
import Navigation from './Navigation'
import CourseSideBar from './CourseSideBar'
import '../App.css';
import {Link } from "react-router-dom";
import { connect } from "react-redux";
import { getCourseDetails } from "../js/actions/actions";

function mapStateToProps(state) {
    return {courseDetails:state.courseDetails}
}

function mapDispatchToProps(dispatch) {
    return {
        getCourseDetails: (courseid) => dispatch(getCourseDetails(courseid))
    };
}
class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: true,
            isStudent:localStorage.getItem("role") === "student",
            courseDetails: null
        }
    }
    async componentDidMount(){
        this.props.getCourseDetails(this.props.match.params.courseid)
    }
    render(){
        const courseid  =this.props.match.params.courseid
        let header = <p className="dash-header-blue">Home</p>
        let content;
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link></p>
            content = <div className="course-content-wrapper">
            <div className="dash-two">
                <div className="header1">{cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}</div>
            </div>
            <div className="home-content">
                <div className="row row-style">
                    <p className="profile-headers">Instructor :</p>
                    <p>{cd.faculty_name}</p>
                </div>
                <div className="row row-style">
                    <p className="profile-headers">Email :</p>
                    <p>{cd.faculty_email}</p>
                </div>
                <div className="row row-style">
                    <p className="profile-headers">Classroom :</p>
                    <p>{cd.room}</p>
                </div>
            </div>
            <h3 className="padding-bottom">Course Description</h3>
            <div>{cd.desc}</div>
            </div>
        } else {
            content = <div className="noContent"><div className="sub-noContent"><p>Content has not been provided for this course.</p></div></div>
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
                        <CourseSideBar coursepath={"/courses/"+courseid} isStudent={this.state.isStudent} parent="Home"></CourseSideBar>
                            {content}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);