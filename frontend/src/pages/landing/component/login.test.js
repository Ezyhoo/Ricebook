import React from 'react';
import {BrowserRouter as Router, MemoryRouter} from 'react-router-dom'

import Login from './login';
import App from '../../../App'
import {render} from "enzyme";
import {shallow} from "enzyme";
import {mount} from "enzyme";

//let app = mount(<App />);

async function getUsersArr() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();
    return data;
}




describe('Login', () => {






    /**
     let username = {
        current:{
            value:'Bret'
        }
    }
     login.instance().refs = login.instance().refs.concat(username);
     console.log(login.instance().refs);
     **/
    let event = new Event("onClick");

    it("Should render login without error", () => {
        let login = shallow(<Login />)
        expect(login.length).toBe(1);
    })

    it("Should handle username input", () => {
        let login = shallow(<Login />)
        expect(login.state('username')).toBe("");
        const event = {target: {value: null}};
        login.instance().handleUsername(event);
        expect(login.state('username')).toBeNull();
    })

    it("Should handle password input", () => {
        let login = shallow(<Login />)
        expect(login.state('password')).toBe("");
        const event = {target: {value: null}};
        login.instance().handlePassword(event);
        expect(login.state('password')).toBeNull();
    })

    it('should log in a previously registered user (not new users)', () => {
        return getUsersArr().then(data => {
            let login = shallow(<Login usersArr={data}/>)
            login.setState({username: "Bret"});
            login.setState({password: "Kulas Light"});
            expect(login.instance().validateLogin(event)).toBe(true);
        });
    });

    it('should not log in an invalid user', () => {
        return getUsersArr().then(data => {
            let login = shallow(<Login usersArr={data}/>)
            expect(login.instance().validateLogin(event, data)).toBe(false);
            login.setState({username: "yizhi"});
            login.setState({password: "K123"});
            expect(login.instance().validateLogin(event, data)).toBe(false);
        });
    })

    it('should update error message state (for displaying login error message to user)', () => {
        return getUsersArr().then(data => {
            let login = shallow(<Login usersArr={data}/>)
            expect(login.state('message')).toBe("");
            login.setState({username: "yizhi"});
            login.setState({password: "K123"});
            login.instance().validateLogin(event);
            expect(login.state('message')).not.toBe("");
        });
    })
})
