import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import PostAddingArea from './postAddingArea';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";


// <PostAddingArea logInUser ={this.props.logInUser} newPost={this.addNewPost}/>

describe('PostAddingArea', () => {


    it("Should render PostAddingArea without error", () => {
        let logInUser = {id: "", name: ""};
        function addNewPost() {};

        let PAA = shallow(<PostAddingArea logInUser={logInUser} newPost={addNewPost}/>)
        expect(PAA.length).toBe(1);
    });

    it("Should able to set post", () => {
        let logInUser = {id: "", name: ""};
        function addNewPost() {};

        let PAA = shallow(<PostAddingArea logInUser={logInUser} newPost={addNewPost}/>)
        PAA.instance().clearText();
        const event = {target: {value: "123"}};
        PAA.instance().setMyPost(event);
        PAA.instance().post();
        expect(PAA.state('myPost')).toBe('');

    });


})
