import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import Navigation from './Navigation';
import '../App.css';
import { connect } from "react-redux";
import { getEnrollmentData } from "../js/actions/actions";

function mapStateToProps(state) {
    return {courseEnrollment:state.courseEnrollment}
}

function mapDispatchToProps(dispatch) {
    return {
        getEnrollmentData: (courseid) => dispatch(getEnrollmentData(courseid))
    };
}
class EnrollCourse extends Component {
    constructor(props){
        super(props);
        this.state = { 
            courseEnrollment: [],
            terms: [],
            courses: [],
            noCourseReturned: false,
            addCourseStatus: "",
            isLoggedIn: true,
            isStudent:localStorage.getItem("role")==="student"
        };
        this.enrollHandler = this.enrollHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.waitlistHandler = this.waitlistHandler.bind(this);
        this.permissionHandler = this.permissionHandler.bind(this);
        
        this.setCourseStudentState = this.setCourseStudentState.bind(this);
    }
    async enrollHandler(){
        let course_id = this.props.courseEnrollment.course_id;
        const enroll = await fetch('/addCourseEnrolled/'+localStorage.getItem("userid"),{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "bearer " + localStorage.getItem("jwtToken"),
            },
            body: JSON.stringify({course_id:course_id})
        })
        const enrollData = await enroll.json();
        if(enrollData.addCourseEnrollment){
            alert("Successfully Enrolled!");
        }
        else{
            alert("Sorry, Enrollment Unsuccessfull!");
        }
        this.props.getEnrollmentData(course_id);
    }
    async permissionHandler(e){
        e.preventDefault();
        const data = new FormData(e.target);
        const addCourseRes = await fetch('/addCourseWithPermission/'+localStorage.getItem("userid"),{
            body: data,
            method: 'POST',
            headers:{
                'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const addCourse = await addCourseRes.json();
        if(addCourse.addCourseEnrollment){
            alert("Successfully Enrolled!");
        }
        else{
            alert("Sorry, Enrollment Unsuccessfull!");
        }
        this.props.getEnrollmentData(this.props.match.params.courseid);
    }
    async dropHandler(){
        let course_id = this.props.courseEnrollment.course_id;
        const drop = await fetch('/dropCourseEnrolled/'+localStorage.getItem("userid")+'?courseid='+course_id,{
            method: 'DELETE',
            headers:{
                'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const dropData = await drop.json();
        if(dropData.dropCourseEnrollment){
            alert("Course Successfully Dropped!");
        }
        else{
            alert("Sorry, Unable to drop course!");
        }
        this.props.getEnrollmentData(course_id);
    }
    async waitlistHandler(){
        let course_id = this.props.courseEnrollment.course_id;
        const waitlist = await fetch('/waitlistCourse/'+localStorage.getItem("userid"),{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "bearer " + localStorage.getItem("jwtToken")
            },
            body: JSON.stringify({course_id:course_id})
        })
        const waitlistData = await waitlist.json();
        if(waitlistData.waitlistCourse){
            alert("Successfully Added to Waitlist!");
        }
        else{
            alert("Sorry, could not add you to the Waitlist!");
        }
        this.props.getEnrollmentData(course_id);
    }
    async setCourseStudentState(){
        // const courseid = this.props.match.params.courseid;
        // // call the backend for data.
        // const enrollmentData = await fetch('/getEnrollmentData/'+localStorage.getItem("userid")+'?courseid='+courseid,{
        //     method: 'GET',
        //     headers:{
        //         'Authorization': "bearer " + localStorage.getItem("jwtToken")
        //     }
        // })
        // const courseEnrollmentData = await enrollmentData.json();
        // this.setState({
        //     courseEnrollment : courseEnrollmentData.courseEnrollment[0]
        // });
    }
    async componentDidMount(){ 
        this.props.getEnrollmentData(this.props.match.params.courseid);
    }

    

    render(){
        if(!this.state.isStudent) {
            return(<Redirect to="/courses"/>)
        }
        let requiredAction;
        // const statusMessage;
        let courseEnrollment = {}
        if(this.props.courseEnrollment != null)
        courseEnrollment = this.props.courseEnrollment
        const course_id = courseEnrollment.course_id;
        const course_number = courseEnrollment.course_number;
        const course_name = courseEnrollment.course_name;
        const capacity = courseEnrollment.capacity;
        const total_enrolled = courseEnrollment.total_enrolled;
        const total_waitlisted = courseEnrollment.total_waitlisted;
        const courseStatus = courseEnrollment.courseStatus;
        const studentStatus = courseEnrollment.studentStatus;
        if(courseStatus === "open" && studentStatus === "NEW"){
            requiredAction = <button onClick={this.enrollHandler} className="custom-button-2">Enroll</button>
        } else if((courseStatus === "open" || courseStatus === "waitlist" || courseStatus === "closed") && studentStatus === "ENROLL"){
            requiredAction = <button onClick={this.dropHandler} className="custom-button-2">Drop</button>
        } else if(courseStatus === "waitlist" && studentStatus === "NEW"){ 
            requiredAction = <button onClick={this.waitlistHandler} className="custom-button-2">Add to Waitlist</button>
        } else if(studentStatus === "WAITLIST"){ 
            requiredAction =
            <form onSubmit={this.permissionHandler}> 
            Permission code:
            <input type="text" className="form-control" name="permissionNumber" />
            <input type="hidden" name="course_id" value={course_id}/>
            <button type="submit" className="custom-button-2">Enroll with permission number</button>
            </form>
        } else if(courseStatus === "closed" && studentStatus !== "ENROLL"){
            requiredAction = <p>Course is closed. No more enrollment allowed.</p>
        }
        // if(this.state.addCourseStatus === true){
        //     statusMessage = <div class="alert alert-success" role="alert">
        //     Successfully Enrolled!
        //   </div>
        // }
        return(  
            <div className="main-wrapper">
                <Navigation></Navigation>
                <div className="content-wrapper">
                    <div className="dash-one">
                        <p className="dash-header padding-bottom20">Enroll Course</p>
                    </div>
                    <div className="course-card-container">
                        <div className="profile-form">
                            <div className="row row-style">
                                <p className="profile-headers">Course ID :</p>
                                <p>{course_id}</p>
                            </div>
                            <div className="row row-style">
                                <p className="profile-headers">Course Number :</p>
                                <p>{course_number}</p>
                            </div>
                            <div className="row row-style">
                                <p className="profile-headers">Course Name :</p>
                                <p>{course_name}</p>
                            </div><div className="row row-style">
                                <p className="profile-headers">Total Enrolled :</p>
                                <p>{total_enrolled}</p>
                            </div>
                            <div className="row row-style">
                                <p className="profile-headers">Total Waitlist :</p>
                                <p>{total_waitlisted}</p>
                            </div>
                            <div className="row row-style">
                                <p className="profile-headers">Course Status :</p>
                                <p>{courseStatus}</p>
                            </div>
                            <div className="row row-style">
                                <p className="profile-headers">Student Status :</p>
                                <p>{studentStatus}</p>
                            </div>
                        {requiredAction}
                        {this.state.addCourseStatus}
                        </div> 
                    </div>

                    

                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (EnrollCourse);