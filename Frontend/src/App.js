import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Main from './Main';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
      <div>
        <Main/>
      </div>
      </Router>
    );
  }
}

export default App;
