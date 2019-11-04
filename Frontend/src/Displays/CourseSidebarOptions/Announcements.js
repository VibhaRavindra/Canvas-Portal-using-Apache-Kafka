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
class Announcements extends Component {
    constructor(props){
        super();
        this.state = {
            isLoggedIn: true,
            isStudent:localStorage.getItem("role") === "student",
            courseDetails:null,
            searchString:"",
            // For Pagination
            all_announcements:[],
            searched_announcements:[],
            announcements:[],
            announcements_per_page: 3,
            num_pages:0
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    handlePageClick(data){
        console.log(data.selected)
        let page_number = data.selected;
        let offset = Math.ceil(page_number * this.state.announcements_per_page)
        this.setState({
            announcements : this.state.searched_announcements.slice(offset, offset +this.state.announcements_per_page)
        })
    }
    searchChangeHandler(e){
        const ss = e.target.value;
        let searched_announcements = []
        this.state.all_announcements.forEach((announcement)=>{
            if(announcement.title.toUpperCase().includes(ss.toUpperCase()) || announcement.content.toUpperCase().includes(ss.toUpperCase())) {
                searched_announcements.push(announcement)
            }
        })
        const pages = Math.ceil(searched_announcements.length/this.state.announcements_per_page)
        this.setState({
            searchString:e.target.value,
            searched_announcements: searched_announcements,
            num_pages: pages,
            announcements: searched_announcements.slice(0, this.state.announcements_per_page)
        })
    }
    async componentDidMount(){
        
        this.props.getCourseDetails(this.props.match.params.courseid)

        const assignDetails = await fetch('/getAnnouncements/'+ 
        this.props.match.params.courseid, {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const assignObj = await assignDetails.json();
        const pages = Math.ceil(assignObj.announcements.length/this.state.announcements_per_page)
        this.setState({
            all_announcements: assignObj.announcements,
            searched_announcements:assignObj.announcements,
            searchString:"",
            announcements: assignObj.announcements.slice(0,this.state.announcements_per_page),
            num_pages: pages
        });
    }
   
    render(){
        const courseid  =this.props.match.params.courseid
        let header = <p className="dash-header-blue">Announcements</p>
        let content;
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/announcements"}>
            Announcements
            </Link> </p>
            let addAnnouncement=null
            if(!this.state.isStudent){
                addAnnouncement = <Link to={"/courses/"+courseid+"/addAnnouncement"}><button className="custom-button-2 addAnnounce-button"><strong>+</strong> Announcement</button></Link>
            }
            if(this.state.announcements.length > 0){
                let tableRows = this.state.announcements.map(
                    (announce) =>{
                            return(
                                <tr>
                                    <td >
                                    <span><img className="announce-profile" alt="user" src={"/getRawImage/"+announce.userid}/></span>
                                    </td>
                                    <td>
                                        <div className="announce-title"><Link to={"/courses/"+courseid+"/announcements/"+announce.id}>{announce.title}</Link></div>
                                        <div className="announce-content">{announce.content.substring(0,60)}</div>
                                    </td>
                                    <td className="col-2">
                                        <div className="posted-on">Posted on:</div>
                                        <div className="posted-timestamp">{announce.timestamp}</div>
                                    </td>
                                </tr>
                            )
                    }
                );
                
                content = <div className="course-content-wrapper">
                <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search Annoucement"/>
                {addAnnouncement}
                <table className="table table-top">
                    <div className=""></div>
                    <thead>
                    </thead>
                    <tbody>
                        {tableRows}
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
            } else {
                content = <div className="course-content-wrapper">
                <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search Annoucement"/>
                {addAnnouncement}
                <div className="noContent"><div className="sub-noContent"><p>You do not have any announcements for this course.</p></div></div>
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
                        <CourseSideBar parent="Announcements" coursepath={"/courses/"+courseid} isStudent={this.state.isStudent}></CourseSideBar>
                        {content}
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Announcements);