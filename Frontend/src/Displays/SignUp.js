import React, { Component } from 'react';
import '../App.css';
import { Redirect,Link } from 'react-router-dom';
import { signUp } from "../js/actions/actions";
import { connect } from "react-redux";

function mapStateToProps(state) {
    return {
        isLoggedIn:state.isLoggedIn,
        signedUpFail:state.signedUpFail,
        signUpFailMessage:state.signUpFailMessage
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signUp: (data) => dispatch(signUp(data))
    };
}

class SignUp extends Component {

    constructor(props){
        super(props);
        this.submitSignUp = this.submitSignUp.bind(this);
    }
    submitSignUp(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        this.props.signUp(data);
    }
    render(){
        let failCase;
        console.log(this.props.isLoggedIn)
        if(this.props.isLoggedIn){
            return(<Redirect to='/dashboard' />);
        } else if (this.props.signedUpFail!= null && this.props.signedUpFail === false) {
            return(<Redirect to='/signin' />);
        } else if(this.props.signedUpFail === true){
            failCase = <div className="error-box">
            <span>
            <img className="error-icon" src="https://www.freeiconspng.com/uploads/alert-icon-red-11.png" alt="" />
            </span>
            <span className="error-msg">{this.props.signUpFailMessage}</span>
        </div>
        }
        return(
            <div>
            <div className="LoginPage">
                <div className="imageHeader">
                    <img className="sjsuImage" src="https://ok2static.oktacdn.com/bc/image/fileStoreRecord?id=fs01heub3azJBMXWF0x7" alt="" />
                    <div className="beacon-container"></div>
                </div>
                
                <div className="LogIncontainer">
                    <p className="signInText">Sign Up</p>
                    {failCase} 
                    <form className="form"  onSubmit={this.submitSignUp}>
                    <input type="text" className="inputStyle1" name="username" placeholder="Name" required />  
                    <input type="email" className="inputStyle1" name="emailId" placeholder="SJSU Email ID" required />                
                    <input type="password" className="inputStyle1" name="password" placeholder="Password" required /> <br />
                    Student<input type="radio" value="student" name="employee" checked/>  
                    Faculty<input type="radio" value="faculty" name="employee" /> 
                    <button type="submit" className="signInBtn">Sign Up</button>
                    </form>
                    <Link to="/signin"><button className="orText">Already signed up?</button></Link>
                </div> 
            </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);