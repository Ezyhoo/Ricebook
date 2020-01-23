import React from 'react';

import App from './App';

import {shallow} from "enzyme";
import{mount} from "enzyme";




describe('App', () => {

    let app = shallow(<App />);

    it("Should render App without error", () => {
        expect(app.length).toBe(1);
    })

    it("Should render App without error", () => {
        expect(app.length).toBe(1);
    })

    it("Should set usersArr when function addUsers called", async () => {
        await app.instance().addUsers();
        expect(app.state("usersArr")).not.toBeNull();
    })

    it("Should set posts when function addUsers called", async () => {
        await app.instance().addPosts();
        expect(app.state("usersArr")).not.toBeNull();
    })

})

