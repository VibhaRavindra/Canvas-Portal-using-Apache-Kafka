import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../App.css';

class CourseSideBar extends Component {
    render(){
        const path  =this.props.coursepath;
        const isStudent = this.props.isStudent;
        const parent = this.props.parent;
        let permissionLink = null
        let gradeLink = null
        const liStyle = {
            'background-color': '#0055a2',
            'border-radius': '4px',
            'color': '#fff',
            'height': '40px',
            'width':'150px',
            'text-decoration': 'none'
        }
        const fontStyle = {
            'color': '#fff'
        }
        const courseListClass = "courseList"
        let peopleStyle = {}, announceStyle = {}, homeStyle = {}, assignStyle = {}, quizStyle = {}, fileStyle = {}, gradeStyle = {},permStyle = {}, peopleFont = {}, announceFont = {}, homeFont = {}, assignFont = {}, quizFont = {}, fileFont = {}, gradeFont = {}, permFont = {}, peopleClass = courseListClass, announceClass = courseListClass, homeClass = courseListClass, assignClass = courseListClass, quizClass = courseListClass, fileClass = courseListClass, gradeClass = courseListClass, permissionClass = courseListClass
        if(parent === "People"){
            peopleStyle = liStyle;
            peopleFont = fontStyle;
            peopleClass += "Active"
        }
        else if(parent === "Home"){
            homeStyle = liStyle
            homeFont = fontStyle;
            homeClass += "Active"
        }
        else if(parent === "Announcements"){
            announceStyle = liStyle
            announceFont = fontStyle;
            announceClass += "Active"
        }
        else if(parent === "Assignments"){
            assignStyle = liStyle
            assignFont = fontStyle;
            assignClass += "Active"
        }
        else if(parent === "Quiz"){
            quizStyle = liStyle
            quizFont = fontStyle;
            quizClass += "Active"
        }
        else if(parent === "Files"){
            fileStyle = liStyle
            fileFont = fontStyle;
            fileClass += "Active"
        }
        else if(parent === "Grades"){
            gradeStyle = liStyle
            gradeFont = fontStyle;
            gradeClass += "Active"
        }
        else if (parent === "Permission"){
            permStyle = liStyle
            permFont = fontStyle;
            permissionClass += "Active"
        }
        // const aStyle={color: 'white',}
        if(!isStudent) {
            permissionLink = <li className={permissionClass} style={permStyle} >
            <Link to ={path +'/permissionGenerator'}>
                <div className="course-side-text" style={permFont}>Permissions</div>
            </Link>
        </li>
        } else {
            gradeLink = <li className={gradeClass} style = {gradeStyle}>
            <Link to ={path +'/grades'}>
                <div style = {gradeFont} className="course-side-text">Grades</div>
            </Link>
        </li>
        }
        
        return(
            <div className="course-sidebar-wrapper">
                <nav className="course-nav-sidebar">
                    <ul className="course-sidebar-components">
                        <li className={homeClass} style={homeStyle}>
                            <Link to ={path +'/home'}>
                                <div style={homeFont} className="course-side-text">
                                    Home 
                                </div>
                            </Link>
                        </li>
                        <li className={announceClass} style={announceStyle}>
                            <Link to ={path +'/announcements'}>
                                <div className="course-side-text" style={announceFont}>Announcements</div>
                            </Link>
                        </li>
                        <li className={assignClass} style = {assignStyle}>
                            <Link to ={path +'/assignments'} >
                                <div style = {assignFont} className="course-side-text">Assignments</div>
                            </Link>
                        </li>
                        {gradeLink}
                        
                        <li className={peopleClass} style={peopleStyle}>
                            <Link to ={path +'/people'}>
                                <div style={peopleFont}className="course-side-text">People</div>
                            </Link>
                        </li>
                        <li className={fileClass} style={fileStyle}>
                            <Link to ={path +'/files'}>
                                <div style={fileFont} className="course-side-text">Files</div>
                            </Link>
                        </li>
                        <li className={quizClass} style={quizStyle}>
                            <Link to ={path +'/quizzes'}>
                                <div  style={quizFont} className="course-side-text" >Quizzes</div>
                            </Link>
                        </li>
                        {permissionLink}
                    </ul>
                </nav>
            </div>
        )
    }
}

export default CourseSideBar;