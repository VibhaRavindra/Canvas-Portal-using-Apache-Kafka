import React from 'react';
import SignIn from './SignIn';
import renderer from 'react-test-renderer';
import { mount, shallow, render } from 'enzyme';
import { Provider } from "react-redux";
import store from "../js/store/store";
import { BrowserRouter as Router } from "react-router-dom";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

it('Sign in renders correctly', () => {
    const tree = renderer
      .create(<Provider store={store}><Router><SignIn/></Router></Provider>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

//   it('Sign in renders correctly', () => {
//     const wrapper = mount(<SignIn/>);
//     wrapper.find('#signupbutton').simulate('click');
//     expect(wrapper).toMatchSnapshot();
//   });