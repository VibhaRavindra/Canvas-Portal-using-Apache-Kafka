import React, { Component } from 'react';
import { Link } from "react-router-dom";
class DashCourseCard extends Component {
    render(){
        let courseItem = this.props.item
        if(courseItem == null) {
            return(<div></div>)
        }
        return( 
            <div className="course-card">
                <Link to={"/courses/"+courseItem.course_id}>
                    <div className="inner-card"></div>
                </Link>
                    <div className="bottom-card">
                <Link to={"/courses/"+courseItem.course_id}>
                    <div className="card-text">
                        <p>{courseItem.dept_id} {courseItem.course_number} {courseItem.course_name}</p>
                    </div>
                </Link>
                <div>
                    <Link to={"/courses/"+courseItem.course_id+"/announcements"}>
                        <i className="fas fa-bullhorn fa-lg fa-icon"></i>
                    </Link>
                    <Link to={"/courses/"+courseItem.course_id+"/assignments"}>
                        <i className="far fa-edit fa-lg fa-icon"></i>
                    </Link>
                    <Link to="/inbox">
                        <i className="far fa-comments fa-lg fa-icon"></i>
                    </Link>
                    <Link to={"/courses/"+courseItem.course_id+"/files"}>
                        <i className="far fa-folder fa-lg fa-icon"></i>
                    </Link>
                </div>
                </div>
            </div>
        )
    }
}
export default DashCourseCard;