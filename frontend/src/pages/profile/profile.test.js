import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import Profile from './profile';
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";


const user = {
    name: "",
    email: "",
    phone: "",
    address:{
        zipcode: "",
        street: "",
    }
}

const logInUser = {id: 1, name: "yi", username: "yh", email: "yh@123.zxc", phone: "123-123-1234", address: {zipcode: "1234", street: "ABC"}};

localStorage.setItem("logInUser", JSON.stringify(logInUser));

describe('Profile', () => {

    it("Should render Profile without error", () => {
        let profile = shallow(<Profile />)
        expect(profile.length).toBe(1);
    })

    it("should fetch the logged in user's profile information", () => {
        let profile = shallow(<Profile />)
        expect(profile.state("logInUser").name).toBe(logInUser.name);
        expect(profile.state("logInUser").email).toBe(logInUser.email);
        expect(profile.state("logInUser").phone).toBe(logInUser.phone);
        expect(profile.state("logInUser").address.zipcode).toBe(logInUser.address.zipcode);
        expect(profile.state("logInUser").address.street).toBe(logInUser.address.street);

    })


    it("Should validate email", () => {
        let profile = shallow(<Profile />)
        const event = {target: {value: "123@qwe.cz"}};

        expect(profile.instance().validateEmail()).toBe(true);

        profile.instance().setEmail(event)
        expect(profile.instance().validateEmail()).toBe(true);

        event.target.value = "123@.cz";
        profile.instance().setEmail(event)
        expect(profile.instance().validateEmail()).toBe(false);

    })

    it("Should validate phone number", () => {
        let profile = shallow(<Profile />)

        expect(profile.instance().validatePhoneNum()).toBe(true);

        const event = {target: {value: "12312312"}};
        profile.instance().setPhoneNum(event)
        expect(profile.instance().validatePhoneNum()).toBe(false);

        event.target.value = "123-123-1234";
        profile.instance().setPhoneNum(event)
        expect(profile.instance().validatePhoneNum()).toBe(true);

    })


    it("Should validate zipcode", () => {
        let profile = shallow(<Profile />)

        expect(profile.instance().validateZipcode()).toBe(true);

        const event = {target: {value: "123123121123"}};
        profile.instance().setZipcode(event)
        expect(profile.instance().validateZipcode()).toBe(false);

        event.target.value = "1231234";
        profile.instance().setZipcode(event)
        expect(profile.instance().validateZipcode()).toBe(true);

    })

    it("Should validate password", () => {
        let profile = shallow(<Profile />)

        expect(profile.instance().validatePassword()).toBe(true);

        const event = {target: {value: "123123121"}};
        const event2 = {target: {value: "1"}};
        profile.instance().setPassword(event)
        profile.instance().setPasswordC(event2)
        expect(profile.instance().validatePassword()).toBe(false);

        event.target.value = "1231234";
        profile.instance().setPassword(event)
        profile.instance().setPasswordC(event)
        expect(profile.instance().validatePassword()).toBe(true);

    })

    it("Should update info", () => {
        let profile = shallow(<Profile />)

        profile.setState({name: "1"});
        profile.setState({email: "1"});
        profile.setState({phoneNum: "1"});
        profile.setState({zipcode: "1"});
        profile.setState({password: "1"});

        profile.instance().updateInfo();

        expect(profile.state('logInUser').name).toBe('1');



        expect(profile.instance().validatePassword()).toBe(true);

    })

    it("Should validate all info", () => {
        let profile = shallow(<Profile />)

        profile.setState({name: "1"});
        profile.setState({email: "1"});
        profile.setState({phoneNum: "1"});
        profile.setState({zipcode: "1"});
        profile.setState({password: "1"});


        expect(profile.instance().validateInfo()).toBe(false);


    })


})
