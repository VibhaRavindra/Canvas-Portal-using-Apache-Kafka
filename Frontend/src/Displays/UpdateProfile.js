import React, { Component } from 'react';
import Navigation from './Navigation'
import {Redirect,Link} from 'react-router-dom'
import Avatar from 'react-avatar-edit'
import '../App.css';
import { connect } from "react-redux";
import { getProfileImage, getProfile, updateImage, updateprofile } from "../js/actions/actions";

function mapStateToProps(state) {
    return {isLoggedIn:state.isLoggedIn,
        userid:state.userid,
    profile:state.profile,
    preview:state.userImage}
}

function mapDispatchToProps(dispatch) {
    return {
        getProfile: (userid) => dispatch(getProfile(userid)),
        updateImage: (data, callback) => dispatch(updateImage(data, callback)),
        updateprofile: (data, callback) => dispatch(updateprofile(data, callback)),
        getProfileImage: (userid) => dispatch(getProfileImage(userid))
    };
}

class UpdateProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: true,
            imageChanged:false,
            preview:null,
            name:null,
            email:null,
            phonenumber:null,
            aboutme:null,
            city:null,
            country:null,
            company:null,
            school:null,
            hometown:null,
            languages:null,
            gender:null,
            profileUpdated:false,
            init:false
        }
        this.onCrop = this.onCrop.bind(this)
        this.changeNameHandler = this.changeNameHandler.bind(this)
        this.changeEmailHandler = this.changeEmailHandler.bind(this)
        this.changePhonenumberHandler = this.changePhonenumberHandler.bind(this)
        this.changeAboutmeHandler = this.changeAboutmeHandler.bind(this)
        this.changeCityHandler = this.changeCityHandler.bind(this)
        this.changeCountryHandler = this.changeCountryHandler.bind(this)
        this.changeCompanyHandler = this.changeCompanyHandler.bind(this)
        this.changeSchoolHandler = this.changeSchoolHandler.bind(this)
        this.changeHometownHandler = this.changeHometownHandler.bind(this)
        this.changeLanguagesHandler = this.changeLanguagesHandler.bind(this)
        this.changeGenderHandler = this.changeGenderHandler.bind(this)
        this.resetForm = this.resetForm.bind(this)
        
        this.submitHandler = this.submitHandler.bind(this)
    }
    async submitHandler(e){
        e.preventDefault();
        const data = new FormData(e.target);
        
        //if image changed upload image.
        let updateImage = {success:true};
        if(this.state.imageChanged){
            this.props.updateImage(this.state.preview, (success)=>{
                updateImage.success=success
            });
        }
        this.props.updateprofile(data, (success)=>{
            this.setState({profileUpdated:success && updateImage});
        })
    }
    onCrop(preview) {
        this.setState({preview:preview, imageChanged:true})
    }

    changeNameHandler(e){
        this.setState({
            name:e.target.value
        })
    }
    changeEmailHandler(e){
        this.setState({
            email:e.target.value
        })
    }
    changePhonenumberHandler(e){
        this.setState({
            phonenumber:e.target.value
        })
    }
    changeAboutmeHandler(e){
        this.setState({
            aboutme:e.target.value
        })
    }
    changeCityHandler(e){
        this.setState({
            city:e.target.value
        })
    }
    changeCountryHandler(e){
        this.setState({
            country:e.target.value
        })
    }
    changeCompanyHandler(e){
        this.setState({
            company:e.target.value
        })
    }
    changeSchoolHandler(e){
        this.setState({
            school:e.target.value
        })
    }
    changeHometownHandler(e){
        this.setState({
            hometown:e.target.value
        })
    }
    changeLanguagesHandler(e){
        this.setState({
            languages:e.target.value
        })
    }
    changeGenderHandler(e){
        this.setState({
            gender:e.target.value
        })
    }
    async resetForm(){
        this.setState({
            preview:null,
            name:null,
            email:null,
            phonenumber:null,
            aboutme:null,
            city:null,
            country:null,
            company:null,
            school:null,
            hometown:null,
            languages:null,
            gender:null
        })
    }
    componentWillReceiveProps(nextProps){
        if(!this.state.init) {
            this.setState({
                name:nextProps.profile.name,
                email:nextProps.profile.email,
                phonenumber:nextProps.profile.phonenumber,
                aboutme:nextProps.profile.aboutme,
                city:nextProps.profile.city,
                country:nextProps.profile.country,
                company:nextProps.profile.company,
                school:nextProps.profile.school,
                hometown:nextProps.profile.hometown,
                languages:nextProps.profile.languages,
                gender:nextProps.profile.gender,
                preview: nextProps.profile.userImage,
                init:true
            })
        }
    }
    componentDidMount(){
        if(this.props.profile != null) {
        this.setState({
            name:this.props.profile.name,
            email:this.props.profile.email,
            phonenumber:this.props.profile.phonenumber,
            aboutme:this.props.profile.aboutme,
            city:this.props.profile.city,
            country:this.props.profile.country,
            company:this.props.profile.company,
            school:this.props.profile.school,
            hometown:this.props.profile.hometown,
            languages:this.props.profile.languages,
            gender:this.props.profile.gender,
            preview: this.state.userImage,
            init:true
        })
        }
        this.props.getProfileImage(localStorage.getItem("userid"));
        this.props.getProfile(localStorage.getItem("userid"));
    }
    
    render(){
        const istyle = {height: '100%', width: '100%', 'object-fit': 'contain'}
        if(this.state.profileUpdated){
            return(<Redirect to="/profile"/>)
        } else {
            let profilePreview = <img src={this.props.preview} style={istyle} alt="profile pic"/>
            if(this.props.preview == null) {
                profilePreview =<i class="fa fa-user fa-7x profile-opacity" aria-hidden="true"></i>
            }
            let profile  ={}
            if(this.props.profile) {
                profile = this.props.profile
            }
            return(
                <div className="main-wrapper">
                    <Navigation></Navigation>
                    <div className="content-wrapper">
                        <div className="dash-one">
                        <p className="dash-header-blue"><Link to={"/profile"}>
                        <p>{profile.name}'s Profile</p></Link></p>
                        </div>
                        
                        <div className="course-card-container profile-contain">
                            <div className="row">
                                <div className="profile-container right-style">
                                    <div className="profile">
                                        {profilePreview}
                                    </div>
                                </div>
                                <Avatar width={200} height={150} onCrop={this.onCrop}/>
                            </div>
                        <form className="updateProfile-form" onSubmit={this.submitHandler}>
                        <div className="row">
                            <p className="profile-headers">Name</p>
                            <input className="input-profile" type="text" required name="name" value={this.state.name} onChange={this.changeNameHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">Email</p>
                            <input className="input-profile" type="email" required name="email" value={this.state.email} onChange={this.changeEmailHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">Phone Number</p>
                            <input className="input-profile" type="phone" name="phonenumber" value={this.state.phonenumber} onChange={this.changePhonenumberHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">About Me</p>
                            <input className="input-profile" type="text" name="aboutme" value={this.state.aboutme} onChange={this.changeAboutmeHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">City</p>
                            <input className="input-profile" type="text" name="city" value={this.state.city} onChange={this.changeCityHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">Country</p>
                            <input className="input-profile" type="text" name="country" value={this.state.country} onChange={this.changeCountryHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">Company</p>
                            <input className="input-profile" type="text" name="company" value={this.state.company} onChange={this.changeCompanyHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">School</p>
                            <input className="input-profile" type="text" name="school" value={this.state.school} onChange={this.changeSchoolHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">Hometown</p>
                            <input className="input-profile" type="text" name="hometown" value={this.state.hometown} onChange={this.changeHometownHandler}></input>
                            </div>
                            <div className="row">
                        <p className="profile-headers">Languages (comma separated)</p>
                            <input className="input-profile" type="text" name="languages" value={this.state.languages} onChange={this.changeLanguagesHandler}></input>
                            </div>
                            <div className="row gender-input">
                        <p className="profile-headers">Gender</p>
                            Male<input type="radio" name="gender" value="male" checked={this.state.gender === "male"} onChange={this.changeGenderHandler}/>
                            
                            Female<input type="radio" name="gender" value="female" checked={this.state.gender === "female"} onChange={this.changeGenderHandler}/> 
                            
                            Other<input type="radio" name="gender" value="other" checked={this.state.gender === "other"} onChange={this.changeGenderHandler}/> 
                            </div>
                            <div className="row">
                           <button className="profile-button" type="submit">Submit</button>
                           </div>
                        </form>
                        </div> 
                    </div>
                </div>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);