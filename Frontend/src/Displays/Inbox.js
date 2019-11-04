import React, { Component } from 'react';
import '../App.css';
import Navigation from './Navigation'
import { Link } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

class Inbox extends Component {
    constructor(props){
        super(props);
        this.state = {
            messagePopUp: false,
            messageType : 'inbox',
            people: [],
            courses: [],
            courseid: null,
            employee: localStorage.getItem("role"),
            from_name:null,
            to_name: null,
            course_idnamemap:{},
            people_idnamemap:{},
            show_message:{},
            // For Pagination
            all_messages:[],
            messages: [],
            messages_per_page: 3,
            num_pages:0
        }
        this.showMessage = this.showMessage.bind(this);
        this.closeMessage = this.closeMessage.bind(this);
        this.composeMessage = this.composeMessage.bind(this);
        this.closePopUp = this.closePopUp.bind(this); 
        this.changeMessageType = this.changeMessageType.bind(this); 
        this.sendMessage = this.sendMessage.bind(this); 
        this.selectCourse = this.selectCourse.bind(this);
        this.selectEmployee = this.selectEmployee.bind(this);
        this.selectPerson = this.selectPerson.bind(this);
        this.populatePeople = this.populatePeople.bind(this);
        this.getMessages = this.getMessages.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }
    showMessage(){}
    closeMessage(){}
    handlePageClick(data){
        console.log(data.selected)
        let page_number = data.selected;
        let offset = Math.ceil(page_number * this.state.messages_per_page)
        this.setState({
            messages : this.state.all_messages.slice(offset, offset +this.state.messages_per_page)
        })
    }
    async composeMessage (){
        this.setState({
            messagePopUp: true
        });
        
        
        let role = localStorage.getItem("role")
        
        const getCourses = await fetch('/getCourses/'+role+"/"+localStorage.getItem("userid"), {
            method: 'GET',
            headers:{
                'Authorization': "bearer " + localStorage.getItem("jwtToken")
            }
        });
        const courses  =await getCourses.json();
        let course_idnamemap = {}
        courses.courseList.forEach(course => {
            course_idnamemap[course.course_id] = course.dept_id +" "+ course.course_number+" "+course.course_name
        });
        this.setState({
            courses : courses.courseList,
            course_idnamemap: course_idnamemap
        });
    }
    async sendMessage(e){
        e.preventDefault();
        const data = new FormData(e.target);
        let to_name = "";
        data.forEach((value, key) => {
            if(key === "messageTo") {
                to_name = this.state.people_idnamemap[value]
            }
        });
        data.append("course_name", this.state.course_idnamemap[this.state.courseid])
        data.append("from_name", this.state.from_name)
        data.append("to_name", to_name)
        const messageSend = await fetch('/sendMessages/'+localStorage.getItem("userid"),{
            method: 'POST',
            body:data,
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const sentMessage = await messageSend.json();
        if(sentMessage.success) {
            alert("Message Successfully Sent!")
        } else {
            alert("Failed to send Message")
        }
    }
    closePopUp(){
        this.setState({
            messagePopUp: false
        });
    }
    changeMessageType = (event) =>{
        this.getMessages(event.target.value);
        this.setState({messageType: event.target.value})
    }
    selectPerson = (event) => {
        console.log("called_select_person")
        this.setState({to_name: this.state.people_idnamemap[event.target.value]})
    }
    selectCourse = (event) => {
        this.setState({courseid: event.target.value})
        this.populatePeople(event.target.value, this.state.employee);
    }
    selectEmployee = (event) => {
        this.setState({employee: event.target.value})
        this.populatePeople(this.state.courseid, event.target.value);
    }
    async populatePeople(courseid, employee) {
        if(courseid !=null && employee != null) {
            const getPeople = await fetch("/getCoursePeople/" + courseid + "/" + employee+"/"+localStorage.getItem("username"), {
                method: 'GET',
                headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
            });
            const people  =await getPeople.json();
            let people_idnamemap = {}
            people.result.people.forEach(people => {
                people_idnamemap[people.id] = people.name
            });
            this.setState({
                people : people.result.people,
                from_name: people.current_name,
                people_idnamemap: people_idnamemap
            });
        }
    }
    async getMessages(messageType){
        const getMessagesDetails = await fetch('/getMessages/'+messageType+"/"+localStorage.getItem("userid"), {
            method:"GET",
            headers:{'Authorization': "bearer " + localStorage.getItem("jwtToken")}
        })
        const getMessages = await getMessagesDetails.json();
        const pages = Math.ceil(getMessages.messages.length/this.state.messages_per_page)
        this.setState({
            all_messages: getMessages.messages,
            messages: getMessages.messages.slice(0,this.state.messages_per_page),
            num_pages: pages
        });
    }
    componentDidMount(){
        this.getMessages(this.state.messageType);
    }
    render(){
        let courseArray = this.state.courses.map(course => {
            return(
                <option value={course.course_id}>{course.dept_id} {course.course_number} {course.course_name}</option>
            )
        })
        let peopleArray = this.state.people.map(person => {
            return (
                <option value={person.id}>{person.name}</option>
            )
        })
        let messageModals = this.state.messages.map(message => {
            return(
            <div class="modal fade" id={"A"+message.id} role="dialog">
                    <div class="modal-dialog modal-lg inbox-modal">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h4 class="modal-title">{message.subject}</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body row">
                        <span className="span1"><img className="modal-profile" alt="user" src={"/getRawImage/"+message.messagerId}/></span>
                        <span className="span2"><strong>{message.from}</strong> , {message.to} <br></br>
                        {message.course}
                        </span>
                        <span className="span3">{message.timestamp}</span>
                        </div>
                        {/* <div className="line"></div> */}
                        
                        <div class="modal-footer1">
                        {/* <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> */}
                        <div className="modal-msgContent">{message.content}</div>
                        </div>
                    </div>
                    </div>
                </div>
            )
        })
        let messageTable = this.state.messages.map(message => {
            return(
                <tr>
                    <td >
                        <span><img className="announce-profile" alt="user" src={"/getRawImage/"+message.messagerId}/></span>
                    </td>
                    <td>
                        <div className="inbox-title"><Link to={"/courses/announcements/"}>From</Link></div>
                        <div className="inbox-content">{message.from}</div>
                    </td>
                    <td>
                        <div className="inbox-title"><Link to={"/courses/announcements/"}>To</Link></div>
                        <div className="inbox-content">{message.to}</div>
                    </td>
                    <td>
                        <div className="inbox-title"><Link to={"/courses/announcements/"}>Subject</Link></div>
                        <div className="inbox-content">{message.subject}</div>
                    </td>
                    <td>
                        <div className="inbox-title"><Link to={"/courses/announcements/"}>Time</Link></div>
                        <div className="inbox-content timestamp">{message.timestamp}</div>
                    </td>
                    <td>
                        <button className="custom-button-2" data-toggle="modal" data-target={"#A"+message.id}>View</button>
                    </td>

                    {/* <td className="msg-from">{message.from}</td>
                    <td className="msg-to">{message.to}</td>
                    <td className="msg-subject">{message.subject}</td>
                    <td className="msg-timestamp">{message.timestamp}</td> */}
                </tr>
            )
        })
        
        
        return(
            <div className="main-wrapper">
                <Navigation></Navigation>
                <div className="content-wrapper">
                    <div className="dash-one">
                        <p className="dash-header padding-bottom20">Inbox</p>
                    </div>
                    <div className="course-card-container">
                        <div className="row">
                            <div class="form-group">
                                <select className="form-control select-options"  name="messageType" onChange={this.changeMessageType}>
                                    <option value="inbox">Inbox</option>
                                    <option value="sent">Sent</option>
                                </select>
                            </div>
                            <button onClick={this.composeMessage} className="custom-button-2 position-button">
                                {/* <i className="far fa-edit fa-lg"></i> */}
                                <i className="fas fa-plus fa-lg"></i>
                                <span className="compose-button">Compose</span>
                            </button>
                        </div>
                        <div className="row">
                        <table class="table table-top inbox-table">
                            {/* <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Subject</th>
                                <th>Timestamp</th>
                            </tr> */}
                            {messageTable}
                        </table>
                        {messageModals}
                        </div>
                        <div className="row">
                            <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={this.state.num_pages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            />
                        </div>
                        <Modal show={this.state.messagePopUp} onHide={this.closePopUp} size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <form onSubmit={this.sendMessage}>
                            <Modal.Header closeButton>
                                <p className="message-header">Compose Message</p>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                <p className="select-class-text inbox-select-course">
                                    Course  
                                </p>
                                <div class="form-group">
                                    <select className="form-control select-options" name="course" onChange={this.selectCourse}>
                                    <option disabled selected value> -- select a course -- </option>
                                    {courseArray}
                                    </select>
                                </div>
                                </div>
                                <input type="radio" value="student" name="employee" onClick={this.selectEmployee}/>  Student
                                <input type="radio" value="faculty" name="employee" onClick={this.selectEmployee}/>  Faculty
                                <div className="row">
                                <p className="select-class-text inbox-select-to">
                                    To          
                                </p>
                                <div class="form-group">
                                    <select className="form-control select-messageTo"  name="messageTo" onChange={this.selectPerson}>
                                    <option disabled selected value> -- select message recepient -- </option>
                                        {peopleArray}
                                    </select>
                                </div>
                                </div>
                                <div className="row">
                                <p className="select-class-text inbox-select-subject">
                                    Subject  
                                </p>
                                <input type="text"  className="inbox-subject" name="subject"  placeholder="No subject" maxlength="255" />
                                </div>
                                <hr></hr>
                                <div className="messageBody">
                                <textarea className="inbox-message" name="body" data-track-category="Compose Message" data-track-action="Edit" data-track-label="Body" aria-label="Body" aria-required="true" ></textarea>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button type="submit" className="custom-button-3" onClick={this.handleClose}>
                                Send
                                </Button>
                            </Modal.Footer>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}

export default Inbox;