import React from 'react';

import Main from './main';
import PostArea from "./component/postArea";
import {shallow} from "enzyme";


async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}

const postsArr = [{id: 1, userId: 1, body: ""}, {id: 2, userId: 2, body: ""}];
const logInUser = {id: 1, name: "", username: "", company: {catchPhrase: ""}};
const followingsArr = [0];

// <Main assignLogInUser = {this.assignLogInUser} usersArr={this.state.usersArr}  postsArr={this.state.postsArr}/>

localStorage.setItem("logInUser", JSON.stringify(logInUser));

describe('Main', () => {

    it("Should render Main without error", () => {
        return getUsersArr().then(data => {

            let main = shallow(<Main usersArr={data}  postsArr={postsArr}/>)
            expect(main.length).toBe(1);
        })
    });


    it("should add articles when adding a follower", () => {
        return getUsersArr().then(data => {
            let main = shallow(<Main usersArr={data}  postsArr={postsArr}/>)
            let PA = shallow(<PostArea logInUser={logInUser} postsArr={postsArr} usersArr={data} followingsArr = {followingsArr}/>)
            expect(PA.state('allPosts').length).toBe(1);
            main.instance().handleNewFollowing(2);
            PA.setProps({followingsArr: main.state('followingsArr')});
            expect(PA.state('allPosts').length).toBe(2);

        })
    });

    it("should remove articles when removing a follower", () => {
        return getUsersArr().then(data => {
            let main = shallow(<Main usersArr={data}  postsArr={postsArr}/>)
            let PA = shallow(<PostArea logInUser={logInUser} postsArr={postsArr} usersArr={data} followingsArr = {followingsArr}/>)
            expect(PA.state('allPosts').length).toBe(1);
            main.instance().handleNewFollowing(2);
            PA.setProps({followingsArr: main.state('followingsArr')});
            expect(PA.state('allPosts').length).toBe(2);
            main.instance().handleUnfollow(2);
            PA.setProps({followingsArr: main.state('followingsArr')});
            expect(PA.state('allPosts').length).toBe(1);

        })
    });






})
