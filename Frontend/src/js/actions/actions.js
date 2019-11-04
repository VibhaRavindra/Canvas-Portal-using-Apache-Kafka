import { COURSE_DETAILS_UPDATE, SIGN_IN,SIGN_OUT,SIGN_UP,USER_PROFILE, USER_IMAGE, GET_COURSE } from "../constants/action-types";

export function getDepartment() {
  return (dispatch) =>{
        fetch('/getDepartment', {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        }).then((res)=>res.json())
        .then((response)=>dispatch(getDepartmentUpdate(response)))
      }
}

function getDepartmentUpdate(response) {
  return { type: "DEPARTMENT", payload:response}
}

export function getTerms() {
  return (dispatch) =>{
        fetch('/getTerms', {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        }).then((res)=>res.json())
        .then((response)=>dispatch(getTermUpdate(response)))
      }
}

function getTermUpdate(response) {
  return { type: "TERM", payload:response}
}

export function getEnrollmentData(courseid) {
  return (dispatch) =>{
        fetch('/getEnrollmentData/'+localStorage.getItem("userid")+'?courseid='+courseid, {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        }).then((res)=>res.json())
        .then((response)=>dispatch(getEnrollmentDataUpdate(response)))
      }
}

function getEnrollmentDataUpdate(response) {
  return { type: "ENROLLDATA", payload:response}
}

export function getCourseDetails(courseid) {
  return (dispatch) =>{
        fetch('/getCourseDetails/'+ 
        courseid+"/"+localStorage.getItem("userid"), {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        }).then((res)=>res.json())
        .then((response)=>dispatch(getCourseDetailsUpdate(response)))
      }
}

function getCourseDetailsUpdate(response) {
  return { type: COURSE_DETAILS_UPDATE, payload:response}
}

export function updateprofile(data, callback) {
  fetch('/updateProfile/'+localStorage.getItem("userid"),{
    body: data,
    method: 'POST',
    headers:{
      'Authorization': "bearer " + localStorage.getItem("jwtToken"),
    }
}).then((res)=>res.json())
.then((res)=>callback(res.success))
return { type: "NO_CHANGE"}
}

export function updateImage(data, callback) {
  let imageData = new FormData();
  imageData.append('image', data);
  fetch('/updateImage/'+localStorage.getItem("userid"),{
    body: imageData,
    method: 'POST',
    headers:{
      'Authorization': "bearer " + localStorage.getItem("jwtToken"),
    }
  }).then((res)=>res.json())
  .then((res)=>callback(res.success))
  return { type: "NO_CHANGE"}
}

function profileImageUpdate(response) {
  return { type: USER_IMAGE, payload:response}
}

export function getProfileImage(userid) {
  return (dispatch) =>{
    fetch("/getProfileImage/"+userid,{
      method:"GET",
      headers:{
        'Authorization': "bearer " + localStorage.getItem("jwtToken"),
      }
  }).then((response)=>response.json())
   .then((response)=>dispatch(profileImageUpdate(response)))
  }
}

export function getProfile(userid) {
  return (dispatch) =>{
    fetch("/getProfileData/"+userid,{
      method:"GET",
      headers:{
        'Authorization': "bearer " + localStorage.getItem("jwtToken"),
      }
  }).then((response)=>response.json())
  .then((response)=>dispatch(profileDataUpdate(response)))
  }
}

function profileDataUpdate(profileJson) {
  if(profileJson.success) {
    return { type: USER_PROFILE, payload:{
      name:profileJson.name,
      email:profileJson.email,
      phonenumber:profileJson.phonenumber,
      aboutme:profileJson.aboutme,
      city:profileJson.city,
      country:profileJson.country,
      company:profileJson.company,
      school:profileJson.school,
      hometown:profileJson.hometown,
      languages:profileJson.languages,
      gender:profileJson.gender
    }}
  }
}
export function signOut(){
  return (dispatch) => {
    fetch('/logout',{
      method: 'GET'
    }).then(()=>dispatch(signOutUpdate()))
  }
}
function signOutUpdate(returndata) {
  localStorage.removeItem("jwtToken")
  localStorage.removeItem("userid")
  localStorage.removeItem("username")
  localStorage.removeItem("isStudent")
  localStorage.removeItem("role")
  return { type: SIGN_OUT}
}
function signInUpdate(returndata) {
  if(returndata.isLoggedIn) {
    localStorage.setItem("jwtToken",returndata.token)
    localStorage.setItem("userid",returndata.userid)
    localStorage.setItem("username",returndata.user_name)
    localStorage.setItem("isStudent",returndata.isStudent)
    localStorage.setItem("role","faculty")
    if(returndata.isStudent) {
      localStorage.setItem("role","student")
    }
  }
  return { type: SIGN_IN, payload:returndata}
}
function signUpUpdate(returndata) {
  return { type: SIGN_UP, payload:returndata}
}
export function signUp(formdata) {
return (dispatch)=>{
fetch('/addUser',{
    body: formdata,
    method: 'PUT'
}).then((response)=>response.json())
.then((response)=>dispatch(signUpUpdate(response)))
}
}
export function signIn(formdata){
  return (dispatch)=>{
    fetch('/getUser',{
      body: formdata,
      method: 'POST'
  }).then(response => response.json())
  .then((response)=>dispatch(signInUpdate(response)))
  }
}

export function updateCourseOrder(course_id_order){
    fetch('/updateCourseOrder/'+localStorage.getItem("userid"),{
      method: 'PUT',
      headers:{
          'Content-Type': 'application/json',
          'Authorization': "bearer " + localStorage.getItem("jwtToken"),
      },
      body:JSON.stringify({order:course_id_order})
  }).then(response => response.json())
  return { type: "NO_CHANGE"}
}
export function getCourses(userid, role) {
  return (dispatch) =>{
    fetch("/getCourses/"+role+"/"+userid,{
      method:"GET",
      headers:{
        'Authorization': "bearer " + localStorage.getItem("jwtToken")
      }
  }).then((response)=>response.json())
  .then((response)=>dispatch(getCoursesUpdate(response)))
  }
}
function getCoursesUpdate(response) {
    return { type: GET_COURSE, payload:response}
}