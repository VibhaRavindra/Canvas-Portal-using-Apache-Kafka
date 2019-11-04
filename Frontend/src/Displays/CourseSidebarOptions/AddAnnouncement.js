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
class AddAnnouncement extends Component {
    constructor(props){
        super();
        this.state = {
            courses: [],
            isLoggedIn: true,
            isStudent:false,
            courseDetails:null,
            title:"",
            content:""
        }
        this.uploadAnnouncement = this.uploadAnnouncement.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }
    changeHandler(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    async uploadAnnouncement(e){
        const courseid  =this.props.match.params.courseid
        e.preventDefault();
        const data = new FormData(e.target);
        const addAssignRes = await fetch('/addAnnouncements/'+courseid,{
            method: 'POST',
            body:data,
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const addAssignJson = await addAssignRes.json();
        if(addAssignJson.success) {
            alert("Announcement created!")
            this.setState({title:"",content:""});
        } else {
            alert("Announcement creation failed")
        }

    }
    async componentDidMount(){
        this.props.getCourseDetails(this.props.match.params.courseid)
    }
   
    render(){
        const courseid  =this.props.match.params.courseid
        if(this.state.isStudent) {
            return(<Redirect to={"/courses/"+courseid+"/assigents"}/>)
        }
        
        let header = <p className="dash-header"></p>
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/addAnnouncement"}>
            Add announcement
            </Link> > </p>
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
                        <div className="course-content-wrapper">
                        <form onSubmit={this.uploadAnnouncement}>
                        <div class="form-group">
                            <label for="title">Announcement Title</label>
                            <input type="text" name="title" class="form-control" placeholder="Assignment Title" value={this.state.title} onChange={this.changeHandler} required/>
                        </div>
                        <div class="form-group">
                        <label for="content">Announcement Content</label>
                        <textarea name="content" value={this.state.content} onChange={this.changeHandler} class="form-control" required/>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (AddAnnouncement);