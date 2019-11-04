import React, { Component } from 'react';
import '../App.css';
import Navigation from './Navigation'
import DashCourseCard from './DashCourseCard';
import { connect } from "react-redux";
import { getCourses, updateCourseOrder } from "../js/actions/actions";

var Reorder = require('react-reorder');
function mapStateToProps(state) {
    return {
        isLoggedIn: state.isLoggedIn,
        isStudent: state.isStudent,
        userid:state.userid,
        courses: state.courses
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getCourses: (userid, role) => dispatch(getCourses(userid, role)),
        updateCourseOrder: (course_id_order) => dispatch(updateCourseOrder(course_id_order))
    };
}

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            dept_id: 0,
            course_number: 0,
            course_name: 0,
            number_of_courses: 0,
            courseList: [],
            courseReorderList:[],
            isLoggedIn: true,
            initialized: false
        }
        this.reorderCallback = this.reorderCallback.bind(this);
    }

    reorderCallback = async function (event, item, index, newIndex, list) {
        let course_id_order = []
        list.forEach((item)=>{
            course_id_order.push(item.course_id)
        })
        this.props.updateCourseOrder(course_id_order)
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.initialized) {
          this.setState({
              initialized:true,
              courseList: nextProps.courses,
              courseReorderList:nextProps.courses
          })
        }
      }
    async componentDidMount(){
        this.props.getCourses(localStorage.getItem("userid"), localStorage.getItem("role"));
    }
    render(){
        let courseList = this.props.courses
        return(
            <div className="main-wrapper">
                <Navigation></Navigation>
                <div className="content-wrapper">
                    <div className="dash-one">
                        <p className="dash-header">Dashboard</p>
                    </div>
                    <div className="course-card-holder">
                        <Reorder
                            itemKey='reorderablecards'
                            holdTime='500'
                            list={courseList}
                            template={DashCourseCard}
                            callback={this.reorderCallback}listClass='row'  
                            itemClass=''
                            disableReorder={false}
                        />
                    </div> 
                </div>
            </div>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);