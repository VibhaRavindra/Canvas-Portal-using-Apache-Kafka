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
class Grades extends Component {
    constructor(props){
        super();
        this.state = {
            courses: [],
            isLoggedIn: true,
            isStudent:true,
            courseDetails:null,
            searchString:"",
            grades:[],
            maxTotal:0,
            totalScore:0
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }
    searchChangeHandler(e){
        this.setState({searchString:e.target.value})
    }
    async componentDidMount(){
        
        this.props.getCourseDetails(this.props.match.params.courseid)
        const gradeDetails = await fetch('/getGrades/'+ 
        this.props.match.params.courseid+"/"+localStorage.getItem("userid"), {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const gradeObj = await gradeDetails.json();
        this.setState({
            grades: gradeObj.grades,
            maxTotal:gradeObj.maxTotal,
            totalScore:gradeObj.totalScore
        });
    }
   
    render(){
        const courseid  =this.props.match.params.courseid
        let header = <p className="dash-header-blue">IndividualCourse</p>
        let content;
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null) {
            let totalPercentage = ((this.state.totalScore / this.state.maxTotal) * 100).toFixed(2);
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/grades"}>
            Grades
            </Link> </p>
            content = <div className="noContent"><div className="sub-noContent"><p>You do not have any grades for {cd.dept_id}-{cd.course_number}.</p></div></div>
            if(this.state.grades.length>0){
            let tableRows = this.state.grades.map(
                (assign) =>{
                    if(assign.name.toUpperCase().includes(this.state.searchString.toUpperCase())){
                        return(
                            <tr>
                                <td>{assign.name}</td>
                                <td>{assign.type}</td>
                                <td>{assign.score}</td>
                                <td>{assign.outof}</td>
                            </tr>
                        )    
                    } else {
                        return null;
                    }
                }
            );
            content = <div className="course-content-wrapper">
            <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search"/>
            <table className="custom-table1 table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Score</th>
                    <th>Out of</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
            </table>
            <table className="custom-table1 table">
                <tbody>
                    <td className="totalContent">Total</td>
                    <td>     </td>
                    <td>     </td>
                    <td>     </td>
                    <td className="score-percentage totalContent">{totalPercentage} %</td>
                    <td className="total-score">{this.state.totalScore} / {this.state.maxTotal}</td>
                </tbody>
            </table>
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
                        <CourseSideBar parent="Grades" coursepath={"/courses/"+courseid} isStudent={this.state.isStudent}></CourseSideBar>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Grades);