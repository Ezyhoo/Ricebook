import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import PostArea from './postArea';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";


async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}

const postsArr = [{id: 1, userId: 1, body: ""}];
const logInUser = {id: 1, name: ""};
const followingsArr = [0];

// <PostArea logInUser={this.state.logInUser} postsArr={this.props.postsArr} usersArr={this.props.usersArr} followingsArr={this.state.followingsArr}/>

describe('PostArea', () => {


    it("Should render PostArea without error", () => {
        return getUsersArr().then(data => {
            let PA = shallow(<PostArea logInUser={logInUser} postsArr={postsArr} usersArr={data} followingsArr = {followingsArr}/>)
            expect(PA.length).toBe(1);
        })
    });

    it("should fetch articles for current logged in user ", () => {
        return getUsersArr().then(data => {
            let PA = shallow(<PostArea logInUser={logInUser} postsArr={postsArr} usersArr={data} followingsArr = {followingsArr}/>)
            expect(PA.state('allPosts').length).toBe(1);
        })
    });


    it("Should able to add post ", () => {
        return getUsersArr().then(data => {
            let PA = shallow(<PostArea logInUser={logInUser} postsArr={postsArr} usersArr={data} followingsArr = {followingsArr}/>)
            let newPost = {id: 2, userId: 2, article: ""};
            PA.instance().addNewPost(newPost);
            expect(PA.state('allPosts').length).toBe(2);
        })
    });

    it("should filter displayed articles by the search keyword ", () => {
        return getUsersArr().then(data => {
            let PA = shallow(<PostArea logInUser={logInUser} postsArr={postsArr} usersArr={data} followingsArr = {followingsArr}/>)
            expect(PA.state('posts').length).toBe(1);
            let event = {target: {value: "123"}};
            PA.instance().searchPost(event);
            expect(PA.state('posts').length).toBe(0);
            event.target.value = " ";
            PA.instance().searchPost(event);
            expect(PA.state('posts').length).toBe(1);
        })
    });




})
