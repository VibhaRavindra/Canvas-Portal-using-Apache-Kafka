import React from 'react';
import SignUp from './SignUp';
import renderer from 'react-test-renderer';
import { mount, shallow, render } from 'enzyme';
import { Provider } from "react-redux";
import store from "../js/store/store";
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router } from "react-router-dom";
configure({ adapter: new Adapter() });

it('Signup renders correctly', () => {
    const tree = renderer
      .create(<Provider store={store}><Router><SignUp/></Router></Provider>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });