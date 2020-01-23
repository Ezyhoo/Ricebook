import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import CommentArea from './commentArea';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";


async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}


describe('CommentArea', () => {


    it("Should render CommentArea without error", () => {
        let CA = shallow(<CommentArea/>)
        expect(CA.length).toBe(1);
    })

    it("Should show all the comments", () => {
        let CA = shallow(<CommentArea/>);
        CA.instance().showAllComments();
        expect(CA.state("moreComments")).toBe("");
    })




})
