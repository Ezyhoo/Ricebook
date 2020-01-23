import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import FollowingList from './followingList';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";


async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}




describe('FollowingList', () => {


    it("Should render FollowingList without error", () => {
        return getUsersArr().then(data => {
            let logInUser = {id: ""};
            function handleNewFollowing(){};
            function handleUnfollow(){};
            let FL = shallow(<FollowingList logInUser={logInUser} usersArr={data}
                                            handleNewFollowing={handleNewFollowing}
                                            handleUnfollow={handleUnfollow}/>)
            expect(FL.length).toBe(1);
        });
    })


    it("Should add following when 'add following' ", () => {
        return getUsersArr().then(data => {
            let logInUser = {name: "Mrs. Dennis Schulist", id: ""};
            function handleNewFollowing(){};
            function handleUnfollow(){};
            let FL = shallow(<FollowingList logInUser={logInUser} usersArr={data}
                                            handleNewFollowing={handleNewFollowing}
                                            handleUnfollow={handleUnfollow}/>)

            FL.setState({input: ""});
            expect(FL.instance().addFollowing()).toBe(false);

            FL.setState({input: "abc"});
            expect(FL.instance().addFollowing()).toBe(false);

            FL.setState({input: "Leanne Graham"});
            expect(FL.instance().addFollowing()).toBe(true);

            FL.setState({input: "Mrs. Dennis Schulist"});
            expect(FL.instance().addFollowing()).toBe(false);

            FL.setState({input: "abc"});
            expect(FL.instance().addFollowing()).toBe(false);

        });
    })


    it("Should unfollow", () => {
        return getUsersArr().then(data => {
            let logInUser = {name: "Mrs. Dennis Schulist", id: ""};
            function handleNewFollowing(){};
            function handleUnfollow(){};
            let FL = shallow(<FollowingList logInUser={logInUser} usersArr={data}
                                            handleNewFollowing={handleNewFollowing}
                                            handleUnfollow={handleUnfollow}/>)


            FL.setState({input: "Leanne Graham"});
            expect(FL.instance().addFollowing()).toBe(true);
            expect(FL.state('followingList').length).toBe(1);

            let user = {id: 1, name: ""};
            FL.instance().unfollowUser(user);
            expect(FL.state('followingList').length).toBe(0);


        });
    })


})
