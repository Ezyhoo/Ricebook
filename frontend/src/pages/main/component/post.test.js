import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import Post from './post';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";


async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}

// <Post key={post.id} author={this.getAuthorById(post.userId)} post={post}/>

describe('Post', () => {

    it("Should render Post without error", () => {
        return getUsersArr().then(data => {
            const id = 0;
            const author = "";
            const post = {article: "", id: 0};
            let FL = shallow(<Post key={id} author={author} post={post}/>)
            expect(FL.length).toBe(1);
        });
    })



})
