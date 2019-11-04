import React, { Component } from 'react';
import { Redirect,Link } from "react-router-dom";
import Navigation from './../Navigation';
import './../../App.css';
import CourseSideBar from '../CourseSideBar'
import ReactPaginate from 'react-paginate';
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
class People extends Component {
    constructor(props){
        super();
        this.state = {
            courses: [],
            isLoggedIn: true,
            isStudent:localStorage.getItem("role")==="student",
            courseDetails:null,
            searchString:"",
            // For Pagination
            all_people:[],
            searched_people:[],
            people:[],
            people_per_page: 3,
            num_pages:0
        }
        this.deleteHandler = this.deleteHandler.bind(this);
        this.getCoursePeople = this.getCoursePeople.bind(this);
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    // For Pagination
    handlePageClick(data){
        console.log(data.selected)
        let page_number = data.selected;
        let offset = Math.ceil(page_number * this.state.people_per_page)
        this.setState({
            people : this.state.searched_people.slice(offset, offset +this.state.people_per_page)
        })
    }
    searchChangeHandler(e){
        const ss = e.target.value;
        let searched_people = []
        this.state.all_people.forEach((people)=>{
            if(people.name.toUpperCase().includes(ss.toUpperCase())) {
                searched_people.push(people)
            }
        })
        // For Pagination
        const pages = Math.ceil(searched_people.length/this.state.people_per_page)
        this.setState({
            searchString:e.target.value,
            searched_people: searched_people,
            num_pages: pages,
            people: searched_people.slice(0, this.state.people_per_page)
        })
    }
    async deleteHandler(e){
        const courseid  =this.props.match.params.courseid
        const deleteRes = await fetch('/deleteStudentFromCourse/'+e.target.name+"/"+courseid,{
            method: 'DELETE',
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const deleteJson = await deleteRes.json();
        if(deleteJson.success) {
            this.getCoursePeople();
        }
    }

    async componentDidMount(){
        this.props.getCourseDetails(this.props.match.params.courseid)
        this.getCoursePeople();
    }
    async getCoursePeople(){
        const courseid  =this.props.match.params.courseid
        // get all the people for the course.
        const coursePeopleRes = await fetch('/getCoursePeople/'+courseid,{
            method: 'GET',
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const coursePeople = await coursePeopleRes.json();

        // For Pagination
        const pages = Math.ceil(coursePeople.people.length/this.state.people_per_page)
        this.setState({
            all_people: coursePeople.people,
            searched_people:coursePeople.people,
            searchString:"",
            people: coursePeople.people.slice(0,this.state.people_per_page),
            num_pages: pages
        });
    }
   
    render(){
        let header = <p className="dash-header-blue">People</p>
        const cd = this.props.courseDetails;
        const courseid  =this.props.match.params.courseid
        let peopleRows = null
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/people"}>
            People
            </Link> </p>
        
            peopleRows = this.state.people.map(
            (people)=>{
                let deleteButton = <td></td>
                if(!this.state.isStudent && people.role==="student") {
                    deleteButton = <td><button className="btn btn-danger" onClick={this.deleteHandler} name={people.id}>Remove</button></td>
                }
                if(people.name.toUpperCase().includes(this.state.searchString.toUpperCase())){
                return(
             <tr>
                 <td><img className="announcement-profile" alt="user" src={"/getRawImage/"+people.id}/></td>
                 <td><Link to={"/profile/"+people.id}>{people.name}</Link></td>
                 <td>{cd.term_name}:{cd.dept_id}-{cd.course_number}</td>
                 <td>{people.role}</td>
                 {deleteButton}
             </tr>   
                )
                } else {
                    return null;
                }
            })
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
                        <CourseSideBar coursepath={"/courses/"+courseid} isStudent={this.state.isStudent} parent="People"></CourseSideBar>
                        <div className="course-content-wrapper">
                        <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search People"/>
                        <table className="table table-striped custom-table2">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Course</th>
                                <th>Role</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {peopleRows}
                        </tbody>
                        </table>
                        {/* For Pagination */}
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
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(People);