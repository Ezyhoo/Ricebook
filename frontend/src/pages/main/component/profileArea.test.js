import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import ProfileArea from './profileArea';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";

async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}
// <ProfileArea logInUser={this.state.logInUser} usersArr = {this.props.usersArr}/>



describe('ProfileArea', () => {

    it("Should render ProfileArea without error", () => {
        return getUsersArr().then(data => {
            let logInUser = {id: "", name: "", username: "", company: {catchPhrase: ""}};
            let PA = shallow(<ProfileArea logInUser={logInUser} usersArr = {data}/>)
            expect(PA.length).toBe(1);
        })
    });

    it("Should change status", () => {
        return getUsersArr().then(data => {
            let logInUser = {id: "", name: "", username: "", company: {catchPhrase: ""}};
            let PA = shallow(<ProfileArea logInUser={logInUser} usersArr = {data}/>)
            const event = {target: {value: "123"}};
            PA.instance().setInput(event);
            PA.instance().changeStatus();
            expect(PA.state('logInUser').company.catchPhrase).toBe("123");
        })
    });


    it("should log out a user (login state should be cleared)", () => {
        return getUsersArr().then(data => {
            let logInUser = {id: "", name: "", username: "", company: {catchPhrase: ""}};
            localStorage.setItem("logInUser", JSON.stringify(logInUser));
            let PA = shallow(<ProfileArea logInUser={logInUser} usersArr = {data}/>)
            PA.find("#log-out").simulate('click');
            expect(localStorage.getItem("logInUser")).toBeNull();
        })
    });





})
