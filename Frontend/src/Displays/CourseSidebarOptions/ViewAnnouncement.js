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
class Announcements extends Component {
    constructor(props){
        super();
        this.state = {
            isLoggedIn: true,
            isStudent:true,
            courseDetails:null,
            searchString:"",
            announcement:{}
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }
    searchChangeHandler(e){
        this.setState({searchString:e.target.value})
    }
    async componentDidMount(){
        
        this.props.getCourseDetails(this.props.match.params.courseid)

        const assignDetails = await fetch('/getAnnouncement/'+ 
        this.props.match.params.announceid, {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const assignObj = await assignDetails.json();
        this.setState({
            announcement: assignObj
        });
    }
   
    render(){
        const courseid  =this.props.match.params.courseid
        let header = <p className="dash-header-blue">Announcements</p>
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/announcements"}>
            Announcements
            </Link> > <Link to={"/courses/"+courseid+"/announcements/"+this.props.match.params.announceid}>
            {this.state.announcement.title}
            </Link></p>
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
                        <div className="course-quiz-container">
                        <div className="question-box">
                            <div className="header-box">
                                <span className="question-number">
                                <img className="announcement-profile" alt="user" src={"/getRawImage/"+this.state.announcement.userid}/></span>
                                <span className="points">{this.state.announcement.username}</span>
                            </div>
                            <div className="question-answer">
                                <div className="question">
                                {this.state.announcement.title}
                                </div>
                                <div className="answer">
                                {this.state.announcement.content}
                                </div>
                                <div className="answer">
                                {this.state.announcement.timestamp}
                                </div>
                            </div>
                            </div>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Announcements);