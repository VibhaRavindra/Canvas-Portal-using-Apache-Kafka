import React, { Component } from 'react';
import '../App.css';
import { Redirect, Link } from 'react-router-dom'
import { signIn } from "../js/actions/actions";
import { connect } from "react-redux";

function mapStateToProps(state) {
    return {isLoggedIn:state.isLoggedIn,
        userid:state.userid,
        IsInvalid:state.IsInvalid,
    errMessage:state.errMessage}
}

function mapDispatchToProps(dispatch) {
    return {
        signIn: (data) => dispatch(signIn(data))
    };
}
class SignIn extends Component {
    constructor(props){
        super(props);
        this.submitSignIn = this.submitSignIn.bind(this);
    }
    async submitSignIn(e){
        e.preventDefault();
        const data = new FormData(e.target);
        this.props.signIn(data);
    }
    
    render(){
        console.log(this.props)
        let redirectRender, redirectDashboard, failCase;
        if(this.props.isLoggedIn === true && this.props.IsInvalid === false){
            redirectDashboard = <Redirect to = '/dashboard' />
        }else if (this.props.IsInvalid === true){
            failCase = <div className="error-box">
            <span>
            <img className="error-icon" src="https://www.freeiconspng.com/uploads/alert-icon-red-11.png" alt="" />
            </span>
            <span className="error-msg">{this.props.errMessage}</span>
        </div>
        }
        
        return(
            <div>
                {redirectDashboard}
            <div className="LoginPage">
                <div className="imageHeader">
                    <img className="sjsuImage" src="https://ok2static.oktacdn.com/bc/image/fileStoreRecord?id=fs01heub3azJBMXWF0x7" alt="" />
                    <div className="beacon-container"></div>
                </div>
                
                <div className="LogIncontainer">
                    <p className="signInText">Sign In</p>
                    {failCase}
                    <form className="form" onSubmit={this.submitSignIn}>
                    <input type="email" className="inputStyle1" name="emailId" placeholder="SJSU Email ID" required />                
                    <input type="password" className="inputStyle1" name="password" placeholder="Password" required /> 
                    <button type="submit" className="signInBtn">Sign In</button>
                    <Link to="/signup"><button className="orText" >Create an account? </button></Link>
                    {redirectRender}
                    </form>
                </div> 
            </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);