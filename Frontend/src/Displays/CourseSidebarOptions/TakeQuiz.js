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
class TakeQuiz extends Component {
    constructor(props){
        super();
        this.state = {
            isLoggedIn: true,
            isStudent:true,
            courseDetails:null,
            quiz:{},
            questions:[],
            quizSubmitted:false
        }
        this.attemptQuiz = this.attemptQuiz.bind(this);
        this.submitQuiz = this.submitQuiz.bind(this);
    }
    async attemptQuiz(){
        // get all questions
        const quizid = this.props.match.params.quizid;
        console.log("Attempting quiz")
        const questionDetails = await fetch('/getQuestions/'+ 
        quizid +"/"+localStorage.getItem("userid"), {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const questions = await questionDetails.json();
        this.setState({
            questions: questions.questions
        });
    }
    async submitQuiz(e) {
        //submit quiz
        e.preventDefault()
        const data = new FormData(e.target);
        var jsondata = {};
        data.forEach((value, key) => {jsondata[key] = value});
        const submitQuizResponse = await fetch('/submitAnswers/'+this.props.match.params.quizid+"/"+localStorage.getItem("userid"),{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                  'Authorization': "bearer " + localStorage.getItem("jwtToken")
                
            },
            body: JSON.stringify({answers : jsondata})
        })
        const submitQuiz = await submitQuizResponse.json();
        if(submitQuiz.success) {
            alert("Quiz submitted, you scored " + submitQuiz.score)
            this.setState({quizSubmitted:true})
        } else {
            alert("unable to submit quiz")
        }
    }
    async componentDidMount(){
        this.props.getCourseDetails(this.props.match.params.courseid)
        const quizDetails = await fetch('/getQuiz/'+this.props.match.params.quizid, {
            method:"GET",
            headers:{
              'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        })
        const quiz = await quizDetails.json();
        this.setState({
            quiz:quiz.quiz
        });
    }
    render(){
        const quizid = this.props.match.params.quizid;
        const courseid  =this.props.match.params.courseid
        if(this.state.quizSubmitted){
            return(<Redirect to={"/courses/"+courseid+"/quizzes"}/>)
        }
        
        let header = <p className="dash-header-blue">Attempt a Quiz</p>
        let content = <h1>Quiz for course {courseid}</h1>
        const cd = this.props.courseDetails;
        if(this.props.courseDetails != null) {
            header = <p className="dash-header-blue"><Link to={"/courses/"+courseid}>
            {cd.term_name}:{cd.dept_id}-{cd.course_number} {cd.course_name}
            </Link> > <Link to={"/courses/"+courseid+"/quizzes"}>
            Quizzes
            </Link> > <Link to={"/courses/"+courseid+"/quizzes/"+quizid}>
            {this.state.quiz.quiz_name}
            </Link></p>
        }
        if(this.state.quiz != null) {
            let questionForm = null
            if(this.state.questions.length > 0) {
                const questionContent = this.state.questions.map((q)=>{
                    return(
                        <div className="question-box">
                            <div className="header-box">
                                <span className="question-number">Question</span>
                                <span className="points">0 / {q.points} pts</span>
                            </div>
                            <div className="question-answer">
                                <div className="question">
                                    {q.question}
                                </div>
                                <div className="answer">
                                    <input type="radio" name={q.question_id} value={q.option1}/>
                                    <label for={q.option1}>{q.option1}</label>
                                </div>
                                <div className="answer">
                                    <input type="radio" name={q.question_id} value={q.option2}/>
                                    <label for={q.option2}>{q.option2}</label>
                                </div>
                                <div className="answer">
                                    <input type="radio" name={q.question_id} value={q.option3}/>
                                    <label for={q.option3}>{q.option3}</label>
                                </div>
                                <div className="answer">
                                    <input type="radio" name={q.question_id} value={q.option4}/>
                                    <label for={q.option4}>{q.option4}</label>
                                </div>
                            </div>
                        </div>
                    )
                })
                questionForm = <form onSubmit={this.submitQuiz}>
                {questionContent}
                <div className="row">
                    <button className="custom-button-2" type="submit">Submit Quiz</button>
                </div>
                </form>
            }
            content = 
            <div>
                <div className="row padding-top20 padding-bottom20">
                    <h4>{this.state.quiz.quiz_name}</h4>
                </div>
                <div className="row">
                    <ul id="quiz-top">
                        <li>
                            <span className="span-heading">Due</span> 
                            <span className="span-value">June 10 at 11:59pm</span>
                        </li>
                        <li>
                            <span className="span-heading">Points</span> 
                            <span className="span-value">{this.state.quiz.total_points}</span>
                        </li>
                        <li>
                            <span className="span-heading">Questions</span> 
                            <span className="span-value">{this.state.quiz.num_questions}</span>
                        </li>
                        <li>
                            <span className="span-heading">Available</span> 
                            <span className="span-value">Mar 10 at 6:38pm - July 17 at 11:59pm</span>
                        </li>
                        <li>
                            <span className="span-heading">Time Limit</span> 
                            <span className="span-value">{this.state.quiz.num_questions} Minutes</span>
                        </li>
                        <li>
                            <span className="span-heading">Allowed Attempts</span> 
                            <span className="span-value">Unlimited</span>
                        </li>
                    </ul>
                </div>
                <div className="instruction-container">
                    <div className="row content-header">
                        <h3>Instructions</h3>
                    </div>
                    <div className="row instruction-text">
                        {this.state.quiz.instructions}
                    </div>
                </div>
                <div className="row">
                    <button className="custom-button-2" onClick={this.attemptQuiz}>
                    Attempt the Quiz</button>
                </div>
                {questionForm}
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
                        <CourseSideBar coursepath={"/courses/"+courseid} isStudent={this.state.isStudent}></CourseSideBar>
                        <div className="course-quiz-container">
                        {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TakeQuiz);