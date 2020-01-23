import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import Register from './register';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";


async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}


describe('Register', () => {


    it("Should render register without error", () => {
        let register = shallow(<Register/>)
        expect(register.length).toBe(1);
    })

    it("Should validate username input", () => {
        return getUsersArr().then(data => {
            let register = shallow(<Register usersArr={data}/>)
            let event = {target: {value: ""}}
            expect(register.instance().isValidUserName(event)).toBe(undefined);
            event.target.value = "1";
            expect(register.instance().isValidUserName(event)).toBe(false);
            event.target.value = "Bret";
            expect(register.instance().isValidUserName(event)).toBe(false);
            event.target.value = "aaa";
            expect(register.instance().isValidUserName(event)).toBe(true);
        })

    });

    it("Should validate email input", () => {
        let register = shallow(<Register/>)
        let event = {target: {value: "12@aosjd"}}
        expect(register.instance().isValidEmail(event)).toBe(false);
        event.target.value = "123@aosjd.ca";
        expect(register.instance().isValidEmail(event)).toBe(true);

    });


    it("Should validate phoneNum input", () => {
        let register = shallow(<Register/>)
        let event = {target: {value: "12123512"}}
        expect(register.instance().isValidPhoneNum(event)).toBe(false);
        event.target.value = "123-123-1234";
        expect(register.instance().isValidPhoneNum(event)).toBe(true);
    });

    it("Should validate zipcode input", () => {
        let register = shallow(<Register/>)
        let event = {target: {value: ""}}
        expect(register.instance().isValidZipcode(event)).toBe(false);
        event.target.value = "12312361234";
        expect(register.instance().isValidZipcode(event)).toBe(false);
        event.target.value = "123161234";
        expect(register.instance().isValidZipcode(event)).toBe(true);
    });

    it("Should validate birthday input", () => {
        let register = shallow(<Register/>)
        let event = {target: {value: "", valueAsDate: null}};
        expect(register.instance().isValidAge(event)).toBe(false);
        event.target.valueAsDate = new Date(2018,11,2);
        expect(register.instance().isValidAge(event)).toBe(false);
        event.target.valueAsDate = new Date(2000,11,2);
        expect(register.instance().isValidAge(event)).toBe(true);
    });

    it("Should validate password input", () => {
        let register = shallow(<Register/>)
        expect(register.instance().doPasswordMatch()).toBe(false);
        let password = {target: {value: "123"}};
        let passwordC = {target: {value: "321"}};
        register.setState({password: password.target.value});
        register.setState({passwordConfirmation: passwordC.target.value});
        expect(register.instance().doPasswordMatch()).toBe(false);

        password.target.value = "123";
        passwordC.target.value = "123";
        register.instance().handlePasswordChange(password);
        register.instance().handleConfirmationChange(passwordC);
        register.setState({password: password.target.value});
        register.setState({passwordConfirmation: passwordC.target.value});
        expect(register.instance().doPasswordMatch()).toBe(true);
    });

    it("Should validate register", () => {
        let register = shallow(<Register/>);
        expect(register.instance().isValidInfo()).toBe(false);
        register.setState({password: 123});
        register.setState({passwordConfirmation: 123});
        expect(register.instance().isValidInfo()).toBe(true);

    });




})
