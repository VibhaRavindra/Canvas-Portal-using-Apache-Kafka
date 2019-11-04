import {COURSE_DETAILS_UPDATE,SIGN_IN, SIGN_OUT,SIGN_UP, USER_IMAGE, USER_PROFILE, GET_COURSE} from "../constants/action-types";
const initialState = {
  courses:[]
};
function rootReducer(state = initialState, action) {
  console.log("in root reducer")
  console.log(state)
  if (action.type === SIGN_IN) {
    return Object.assign({}, state, {
      isLoggedIn:action.payload.isLoggedIn,
      IsInvalid:action.payload.IsInvalid,
      isStudent:action.payload.isStudent,
      userid:action.payload.userid,
      errMessage:action.payload.errMessage,
      authtoken: action.payload.token
    });
  } else if(action.type === SIGN_OUT) {
    return initialState;
  } else if(action.type === SIGN_UP) {
    return Object.assign({}, state, {
      signedUpFail:action.payload.isInvalid,
      signUpFailMessage:action.payload.errMessage
    });
  } else if(action.type === USER_IMAGE) {
    if(action.payload.success) {
      return Object.assign({}, state, {
        userImage:action.payload.image
      });
    } else {
      return Object.assign({}, state, {
        userImage:null
      });
    }
  } else if(action.type === USER_PROFILE) {
    return Object.assign({}, state, {
      profile:action.payload
    });
  } else if(action.type === GET_COURSE) {
    return Object.assign({}, state, {
      courses:action.payload.courseList
    });
  }else if(action.type === COURSE_DETAILS_UPDATE) {
    return Object.assign({}, state, {
      courseDetails:action.payload
    });
  } else if (action.type === "DEPARTMENT") {
    return Object.assign({}, state, {
      department:action.payload.department
    });
  }else if (action.type === "TERM") {
    return Object.assign({}, state, {
      terms:action.payload.terms
    });
  }else if (action.type === "ENROLLDATA") {
    return Object.assign({}, state, {
      courseEnrollment : action.payload.courseEnrollment[0]
    });
  }
  return state;
}
export default rootReducer;