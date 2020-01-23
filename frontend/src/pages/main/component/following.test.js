import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import Following from './following';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";


async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}


describe('Following', () => {


    it("Should render Following without error", () => {
        let prop = {name: "", company: {catchPhrase: ""}};
        function handleUnfollow() {}
        let FL = shallow(<Following user={prop} handleUnfollow = {handleUnfollow}/>)
        FL.find("Button").simulate('click');
        expect(FL.length).toBe(1);
    })





})
