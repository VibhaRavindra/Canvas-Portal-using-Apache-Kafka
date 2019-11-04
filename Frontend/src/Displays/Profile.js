import React, { Component } from 'react';
import Navigation from './Navigation'
import { Link } from "react-router-dom";
import '../App.css';
import { connect } from "react-redux";
import { getProfileImage, getProfile } from "../js/actions/actions";

function mapStateToProps(state) {
    return {isLoggedIn:state.isLoggedIn,
        userid:state.userid,
    profile:state.profile,
    preview:state.userImage}
}

function mapDispatchToProps(dispatch) {
    return {
        getProfile: (userid) => dispatch(getProfile(userid)),
        getProfileImage: (userid) => dispatch(getProfileImage(userid))
    };
}

class Profile extends Component {
    
    componentDidMount(){
        let currentUserId = localStorage.getItem("userid");
        if(this.props.match.params.profileid){
            currentUserId = this.props.match.params.profileid
        }
        this.props.getProfileImage(currentUserId);
        this.props.getProfile(currentUserId);
    }
    render(){
        let updateProfile = null;
        if(this.props.match.params.profileid && this.props.match.params.profileid === String(localStorage.getItem("userid"))) {
            updateProfile = <div className="update-profile-btn">
            <Link to="/updateprofile" className="link"><i class="fas fa-user-edit"></i> Update Profile</Link>
        </div>
        } else if(!this.props.match.params.profileid) {
            updateProfile = <div className="update-profile-btn">
            <Link to="/updateprofile" className="link"><i class="fas fa-user-edit"></i> Update Profile</Link>
        </div>
        }
        const istyle = {height: '100%', width: '100%', 'object-fit': 'contain'}
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
                        <p className="dash-header-blue"><Link to={"/profile/"+this.props.userid}>
            <p>{profile.name}'s Profile</p>
            </Link></p>
                        {/* </div> */}
                        <div className="course-card-container">
                        <div className="row">
                            <div className="profile-container">
                                <div className="profile">
                                    {profilePreview}
                                </div>
                            </div>
                            
                            <div className="profile-form">
                                <div className="row row-style">
                                    <p className="profile-headers">Name :</p>
                                    <p>{profile.name}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">Email :</p>
                                    <p>{profile.email}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">Phone Number :</p>
                                    <p>{profile.phonenumber}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">About Me :</p>
                                    <p>{profile.aboutme}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">City :</p>
                                    <p>{profile.city}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">Country :</p>
                                    <p>{profile.country}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">Company :</p>
                                    <p>{profile.company}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">School :</p>
                                    <p>{profile.school}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">Hometown :</p>
                                    <p>{profile.hometown}</p>
                                </div>
                                <div className="row">
                                    <p className="profile-headers">Languages (comma separated) :</p>
                                    <p>{profile.languages}</p>
                                </div>
                                <div className="row row-style">
                                    <p className="profile-headers">Gender :</p>
                                    <p>{profile.gender}</p> 
                                </div>
                            </div>

                            {updateProfile}
                        </div> 
                        </div>
                    </div>
                    </div>
                </div>
                
            )

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);