import React, { Component } from 'react';
import { Redirect,Link } from "react-router-dom";
import Navigation from './../Navigation';
import './../../App.css';
import CourseSideBar from '../CourseSideBar'
import QuizDetailsQuestions from "./QuizDetailsQuestions"
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

class Quizzes extends Component {
    constructor(props){
        super();
        this.state = {
            isLoggedIn: true,
            isStudent:localStorage.getItem("role")==="student",
            searchString:"",
            quizzes:[]
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this);
    }

    searchChangeHandler(e){
        this.setState({searchString:e.target.value})
    }
    
    async componentDidMount(){
        this.props.getCourseDetails(this.props.match.params.courseid)
        
        if(localStorage.getItem("role")==="student"){
            const quizDetails = await fetch('/getQuizzes/'+ 
            this.props.match.params.courseid, {
                method:"GET",
                headers:{
                  'Authorization': "bearer " + localStorage.getItem("jwtToken")
                }
            })
            const quizzes = await quizDetails.json();
            this.setState({
               quizzes: quizzes.quizzes
            });
        }
    }
    

    render(){
        const courseid  =this.props.match.params.courseid
        let header = <p className="dash-header-blue">IndividualCourse</p>
        let content;
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/quizzes"}>
            Quizzes
            </Link></p>
            if(this.state.isStudent){
                // render student view of quizzes.
                if(this.state.quizzes.length>0) {
                    let quizRows = this.state.quizzes.map((quiz)=>{
                        if(quiz.quiz_name.toUpperCase().includes(this.state.searchString.toUpperCase())){
                        return <div className="one-quiz-contain"><Link to={"/courses/"+courseid+"/quizzes/"+quiz.quiz_id}><div>
                            <div className="quiz-name">{quiz.quiz_name}</div>
                            <div className="second-row">
                                <span className="second-row-span">{quiz.num_questions} Questions    |</span>
                                <span className="second-row-span">   {quiz.total_points} Points</span>
                            </div>
                        </div></Link></div>
                        } else {
                            return null;
                        }
                    });
                    content = <div className="course-content-wrapper">
                        <input className="search-box" type="text" onChange={this.searchChangeHandler} value={this.state.searchString} name="searchbox" placeholder="Search for Quiz"/>
                        <div className="quiz-collection-container">
                            {quizRows}
                        </div>
                    </div>
                } else {
                    content = <div className="noContent"><div className="sub-noContent"><p>You do not have any quiz available for this course.</p></div></div>
                }
            } else {
                // render faculty view of quizzes
                content = <QuizDetailsQuestions courseid={courseid}/>
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
                        <CourseSideBar parent="Quiz" coursepath={"/courses/"+courseid} isStudent={this.state.isStudent}></CourseSideBar>
                        <div className="course-card-container profile-contain">
                        {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quizzes);