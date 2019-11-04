import React, { Component } from 'react';
import Navigation from '../Navigation'
import CourseSideBar from '../CourseSideBar'
import '../../App.css';
import {Redirect, Link } from "react-router-dom";
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
class PermissionGenerator extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: true,
            isStudent:false,
            permissions: [],
            courseDetails: null
        }
        this.generateHandler = this.generateHandler.bind(this);
    }
    async generateHandler(e){
        e.preventDefault();
        const data = new FormData(e.target);
        const permissionsResponse = await fetch('/generatePermissions/'+ 
        this.props.match.params.courseid+"/"+localStorage.getItem("userid"), {
            method:"POST",
            body:data,
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const permissions = await permissionsResponse.json();
        this.setState({
            permissions: permissions.permissions
        });
    }
    async componentDidMount(){
        this.props.getCourseDetails(this.props.match.params.courseid)
        
    }

    render(){
        const courseid = this.props.match.params.courseid;
        if(this.state.isStudent){
            return(<Redirect to="/courses"/>)
        } else {
            let header = <div className="header1"> Generate permissions for </div>;
            let cd = this.props.courseDetails;
            if(cd != null) {
                header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link></p>
            }
            let insideHeader = <div className="header1"> Generate permissions for </div>;
            if(cd != null) {
                insideHeader = <div className="header1"> Generate permissions for {cd.course_name}</div>;
            }
            let waitlisted = "0"
            if(cd!=null){
                waitlisted = cd.total_waitlisted
            }
            let permissionTable = ""
            if(this.state.permissions.length>0) {
                let permissionRows = this.state.permissions.map(permissions => {
                    return (
                        <tr><td>{permissions}</td></tr>
                    )
                })
                permissionTable = 
                <div>
                    <h3>Generated permission codes are:</h3> 
                <table className="table">
                {permissionRows}
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
                        <CourseSideBar parent="Permission" coursepath={"/courses/"+courseid} isStudent={this.state.isStudent}></CourseSideBar>
                        <div className="course-content-wrapper">
                        <div className="dash-one padding-bottom20">
                            {insideHeader}
                        </div>
                        <div className="form-group">
                            <form onSubmit={this.generateHandler}>
                            <table className="table">
                            <thead>
                            
                            </thead>
                            <tr>
                                <td>Number of waitlisted students</td>
                                <td>{waitlisted}</td>
                            </tr>
                            <tr>
                                <td>Number of permissions to be generated</td>
                                <td><input type="number" name="number" required/></td>
                            </tr>
                            <tr>
                                <td><button className="custom-button-2" type="reset">Clear</button></td>
                                <td><button className="custom-button-2" type="submit">Submit</button></td>
                            </tr>
                            </table>
                            
                            </form>  
                            </div>
                            <div>
                                {permissionTable}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (PermissionGenerator);