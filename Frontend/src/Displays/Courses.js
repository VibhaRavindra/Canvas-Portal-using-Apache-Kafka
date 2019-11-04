import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import Navigation from './Navigation';
import { connect } from "react-redux";
import '../App.css';
import { getCourses } from "../js/actions/actions";
import ReactPaginate from 'react-paginate';

function mapStateToProps(state) {
    return {
        isLoggedIn: state.isLoggedIn,
        isStudent: state.isStudent,
        userid:state.userid,
        courses: state.courses
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getCourses: (userid, role) => dispatch(getCourses(userid, role))
    };
}

class Courses extends Component {
    constructor(props){
        super();
        this.state = {
            searchString:"",
            // for pagination
            searched_courses:[],
            courses:[],
            courses_per_page: 3,
            num_pages:0,
            initialized:false
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    handlePageClick(data){
        console.log(data.selected)
        let page_number = data.selected;
        let offset = Math.ceil(page_number * this.state.courses_per_page)
        this.setState({
            courses : this.state.searched_courses.slice(offset, offset +this.state.courses_per_page)
        })
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.initialized) {
          this.setState({
              initialized:true,
              searchString:"",
              searched_courses: nextProps.courses,
              num_pages: Math.ceil(nextProps.courses.length/this.state.courses_per_page),
              courses: nextProps.courses.slice(0, this.state.courses_per_page)
          })
        }
      }
    searchChangeHandler(e){
        const ss = e.target.value;
        let searched_courses = []
        this.props.courses.forEach((course)=>{
            if(course.course_name.toUpperCase().includes(ss.toUpperCase())) {
                searched_courses.push(course)
            }
        })
        const pages = Math.ceil(searched_courses.length/this.state.courses_per_page)
        this.setState({
            searchString:e.target.value,
            searched_courses: searched_courses,
            num_pages: pages,
            courses: searched_courses.slice(0, this.state.courses_per_page)
        })
    }
    componentDidMount(){
        this.props.getCourses(localStorage.getItem("userid"), localStorage.getItem("role"));
    }
   
    render(){
        let userRole = localStorage.getItem("role").charAt(0).toUpperCase() + localStorage.getItem("role").slice(1);
        let courseDetails = this.state.courses.map(course => {      
            return(
                <tr>
                    {/* <td onClick={this.courseClick(course.CourseId)}>{course.CourseName}</td> */}
                    <td><Link to={"/courses/"+course.course_id}>
                    {course.dept_id}-{course.course_number} {course.course_name}</Link></td>
                    <td>{course.term_name}</td>
                    <td>{userRole}</td>
                    <td>Yes</td>
                    {/* <td>{course.EnrolledAs}</td>
                    <td>{course.Published}</td> */}
                </tr>
            )
        })
        return(

            <div className="main-wrapper">
                <Navigation></Navigation>
                <div className="content-wrapper">
                    <div className="dash-one">
                        <p className="dash-header padding-bottom20">All Courses</p>
                    </div>
                    <div className="course-card-container">
                    <input type="text" onChange={this.searchChangeHandler} value={this.state.searchString} className="search-box" name="searchbox" placeholder="Search Courses"/>
                    <table class="table">
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Term</th>
                                    <th>Enrolled as</th>
                                    <th>Published</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseDetails}
                            </tbody>
                        </table>
                        <div className="row">
                            <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.num_pages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            />
                        </div>
                    </div> 
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Courses);