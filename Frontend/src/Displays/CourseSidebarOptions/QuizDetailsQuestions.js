import React, { Component } from 'react';
import {Redirect} from 'react-router'
class QuizDetailsQuestions extends Component {
    constructor(props){
        super();
        this.state = {
            detailsAdded: false,
            quiz_submitted:false,
            questions:[],
            quiz_name:null,
            quiz_instructions:null,
            temp_question:null,
            temp_option1:null,
            temp_option2:null,
            temp_option3:null,
            temp_option4:null,
            temp_points:0
        }
        this.quizCreate = this.quizCreate.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.nextQuestion = this.nextQuestion.bind(this)
        this.submitQuestion = this.submitQuestion.bind(this)
    }

    nextQuestion(){
        const st = this.state;
        this.state.questions.push({
            question:st.temp_question,
            points: st.temp_points,
            correct_option:st.temp_option1,
            option2: st.temp_option2,
            option3: st.temp_option3,
            option4: st.temp_option4
        });
        this.setState({
            temp_question:"",
            temp_option1:"",
            temp_option2:"",
            temp_option3:"",
            temp_option4:"",
            temp_points:0
        })
    }

    async submitQuestion(e){
        e.preventDefault();
        this.nextQuestion();
        const data = {quiz_name: this.state.quiz_name,
        quiz_instructions: this.state.quiz_instructions,
        questions:this.state.questions, course_id:this.props.courseid}
        let quizCreateResponse = await fetch("/createQuiz", {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                  'Authorization': "bearer " + localStorage.getItem("jwtToken")
                
            },
            body:JSON.stringify(data)
        });
        let quizCreateStatus = await quizCreateResponse.json();
        if(quizCreateStatus.success) {
            alert("Quiz created!")
            this.setState({quiz_submitted:true});
        } else {
            alert("Quiz Creation Failed")
        }
    }

    quizCreate(e){
        e.preventDefault();
        this.setState({detailsAdded:true})
    }
    changeHandler(e) {
        this.setState({[e.target.name]: e.target.value});
    }
    render(){
        if(this.state.quiz_submitted) {
            return(<Redirect to={"/courses/"+this.props.courseid}/>)
        }
        if(!this.state.detailsAdded){
            // show addin quiz

            return(
                <form  className="updateProfile-form" onSubmit={this.quizCreate}>
                <div className="row">
                <p className="profile-headers quiz-headers">Quiz name</p>
                <input className="input-profile" type="text" onChange={this.changeHandler} required name="quiz_name" value={this.state.quiz_name}placeholder="Quiz Name" />
                </div>
                <div className="row">
                <p className="profile-headers quiz-headers"> Quiz instructions</p>
                <textarea className="input-profile" name="quiz_instructions" onChange={this.changeHandler} value={this.state.quiz_instructions} />
                </div>
                <div className="quizAdd1-btn-set">
                    <button className="custom-button-2 clear-btn" type="reset">Clear</button>
                    <button className="custom-button-2" type="Submit">Save &amp; Add Questions</button>
                </div>
                </form>
            )
        } else {
            return(
                <form className="updateProfile-form"  onSubmit={this.submitQuestion}>
                <div className="row">
                <p className="profile-headers">Question</p>
                <textarea className="input-profile" onChange={this.changeHandler} required name="temp_question" value={this.state.temp_question} placeholder="Enter Question" />
                </div>
                <div className="row">
                <p className="profile-headers">Points</p>
                <input className="input-profile" type="number" min="0" onChange={this.changeHandler} required name="temp_points" value={this.state.temp_points} placeholder="0" />
                </div>
                <div className="row">
                <p className="profile-headers">Correct Answer</p>
                <input className="input-profile" type="text" onChange={this.changeHandler} required name="temp_option1" value={this.state.temp_option1} placeholder="Correct option" />
                </div>
                <div className="row">
                <p className="profile-headers">Option 2</p>
                <input className="input-profile" type="text" onChange={this.changeHandler} required name="temp_option2" value={this.state.temp_option2} placeholder="Option text" />
                </div>
                <div className="row">
                <p className="profile-headers">Option 3</p>
                <input className="input-profile" type="text" onChange={this.changeHandler} required name="temp_option3" value={this.state.temp_option3} placeholder="Option text" />
                </div>
                <div className="row">
                <p className="profile-headers">Option 4</p>
                <input className="input-profile" type="text" onChange={this.changeHandler} required name="temp_option4" value={this.state.temp_option4} placeholder="Option text" />
                </div>
                <div className="quizAdd1-btn-set">
                    <button className="custom-button-2 clear-btn" type="button" name="b1" onClick={this.nextQuestion}>Next Question</button>
                    <button className="custom-button-2" type="submit" name="b2">Save</button>
                </div>
                </form>
            )
        }
    }
}
export default QuizDetailsQuestions;