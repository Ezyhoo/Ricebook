import React, {Component} from "react";
import ricebookLogo from "../../../logo.jpg";
import "../landingStyle.css";
import Button from 'react-bootstrap/Button';
import {serverURL} from "../../../url"

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {

            username: "",
            email: "",
            phoneNum: "",
            birthday: "",
            zipCode: "",
            password: "",
            passwordConfirmation: "",

            userNameRes: "",
            emailRes: "",
            phoneNumRes: "",
            birthdayRes: "",
            zipCodeRes: "",
            passwordRes: "",
            registerRes: "",
        }


    }


    isValidInfo = () => {
        let res = true;
        if(this.state.password === "" || this.state.passwordComfirmation === "" || this.state.userNameRes !== "" || this.state.emailRes !== "" || this.state.phoneNumRes !== ""
            || this.state.birthdayRes !== "" || this.state.zipCodeRes !== "" || this.state.passwordRes !== "" ){
            res = false;
        }
        if (res) {
            //this.createNewUser();
            this.setState({registerRes: "Register Success"});
            this.addUser();
            return true;
        } else {
            this.setState({registerRes: "Register Failed! See above"});
            return false;
        }
    }

    addUser = async () => {
        const newUser = {
            username: this.state.username,
            email: this.state.email,
            dob: this.state.birthday,
            zipcode: this.state.zipCode,
            password: this.state.password,
        }
        await fetch(`${serverURL}register`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newUser)
        })
            .then(res => console.log(res))
    }
    isValidUserName = (event) => {
        let username = event.target.value;
        if (username === "") {
            return;
        }
        if (!/^[A-Za-z]\w*$/.test(username)) {
            this.setState({userNameRes: "Please follow username instructions"});
            return false;
        }
        if (!this.isUserNameUnique(username)) {
            this.setState({userNameRes: "Username already exist"});
            return false;
        }
        this.setState({username})
        this.setState({userNameRes: ""});
        return true;
    }
    isUserNameUnique = username => {
        let res = true;
        //console.log(this.props.usersArr);
        this.props.usersArr.forEach((user) => {
            if (user.username === username) {
                res = false;
            }
        })
        return res;
    }
    isValidEmail = (event) => {
        let email = event.target.value;
        if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
            this.setState({emailRes: ""});
            this.setState({email})
            return true;
        } else {
            this.setState({emailRes: "Please enter a valid email"});
            return false;
        }
    }

    isValidPhoneNum = (event) => {
        let phoneNum = event.target.value;
        if (/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phoneNum)) {
            this.setState({phoneNumRes: ""});
            this.setState({phoneNum});
            return true;
        } else {
            this.setState({phoneNumRes: "Please follow the format: XXX-XXX-XXXX"});
            return false;
        }
    }
    isValidZipcode = (event) => {
        let zipCode = event.target.value;
        if (zipCode === "") {
            this.setState({zipCodeRes: "Please enter a zipcode"});
            return false;
        }
        if (zipCode.length === 5) {
            this.setState({zipCodeRes: ""});
            this.setState({zipCode})
            return true;
        } else {
            this.setState({zipCodeRes: "Please enter a zipcode"});
            return false;
        }
    }

    isValidAge = (event) => {
        let birthday = event.target;
        if (birthday.valueAsDate === null) {
            this.setState({birthdayRes: "Please enter your birthday"});
            return false;
        }
        //console.log(event.target.value);
        let now = new Date();
        let birthDate = birthday.valueAsDate;
        birthDate = new Date(birthDate.getTime() + birthDate.getTimezoneOffset() * 60000);
        let age = now.getFullYear() - birthDate.getFullYear();
        let month = now.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && now.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            this.setState({birthdayRes: "Only 18 or older can register"});
            return false;
        }
        const token = event.target.value.split('-');
        const dob = `${token[1]}/${token[2]}/${token[0]}`
        //console.log(dob);
        this.setState({birthdayRes: ""});
        this.setState({birthday: dob});
        return true;
    }

    doPasswordMatch = () => {
        let password = this.state.password;
        let passwordConfirmation = this.state.passwordConfirmation;
        if (password === '' || passwordConfirmation === '') {
            this.setState({passwordRes: "Password cannot be empty!"});
            return false;
        }
        if (password === passwordConfirmation) {
            this.setState({passwordRes: ""});
            return true;
        } else {
            this.setState({passwordRes: "Password does not match!"});
            return false;
        }
    }

    handlePasswordChange = event => {
        this.setState({password: event.target.value},
            () => this.doPasswordMatch());
    }

    handleConfirmationChange = event => {
        this.setState({passwordConfirmation: event.target.value},
        () => this.doPasswordMatch());
    }


    render() {
        return (
            <div className="main-container" ref={this.props.containerRef}>
                <div className="header">Register</div>
                <div className="content">
                    <div className="smallLogo">
                        <img src={ricebookLogo} alt="login"/>
                    </div>

                    <br/>
                    <p className="required-field"><i>Required field followed by </i></p>
                    <form className="form">
                        <div className="form-group">
                            <label htmlFor="username" className="required-field">UserName</label>
                            <p className="note">Only numbers and letters allowed</p>
                            <p className="note">Must not start with number</p>
                            <input type="text" id="username" placeholder="username"
                                   onChange={this.isValidUserName}
                                   pattern="[A-Za-z][0-9A-Za-z]*" required
                                   title="Username can only be letters and numbers and must not start with a number"
                            />
                            <p style={{color: "red", fontWeight: "bold"}}>{this.state.userNameRes}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="displayName">Display Name</label>
                            <input type="text" id="displayName" placeholder="display name" ref={this.displayName}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="required-field">Email</label>
                            <input type="email" id="email" placeholder="email"
                                   onChange={this.isValidEmail}
                                   title="Please enter a valid email"
                                   pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required/>
                            <p style={{color: "red", fontWeight: "bold"}}>{this.state.emailRes}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNum" className="required-field">Phone Number</label>
                            <input type="tel" id="phoneNum" placeholder="XXX-XXX-XXXX"
                                   onChange={this.isValidPhoneNum}
                                   pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}' required/>
                            <p style={{color: "red", fontWeight: "bold"}}>{this.state.phoneNumRes}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthday" className="required-field">Data of Birth</label>
                            <p className="note">You have to be 18 or older in order to register</p>
                            <input type="date" id="birthday" onChange={this.isValidAge}
                                   pattern='[0-9]{2}/[0-9]{2}/{0-9}{4}' required/>
                            <p style={{color: "red", fontWeight: "bold"}}>{this.state.birthdayRes}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="zipCode" className="required-field">ZipCode</label>
                            <input type="number" id="zipCode" placeholder="zip code"
                                   onChange={this.isValidZipcode}
                                   max="99999" title="Zip code is 5 digit." required/>
                            <p style={{color: "red", fontWeight: "bold"}}>{this.state.zipCodeRes}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="required-field">Password</label>
                            <input type="password" id="password" placeholder="password" onChange={this.handlePasswordChange} required/>
                        </div>
                        <p style={{color: "red", fontWeight: "bold"}}>{this.state.passwordRes}</p>
                        <div className="form-group">
                            <label htmlFor="passwordConfirmation" className="required-field">Password
                                Confirmation</label>
                            <input type="password" id="passwordConfirmation" placeholder="password confirmation"
                                   onChange={this.handleConfirmationChange} required/>
                        </div>
                        <p style={{color: "red", fontWeight: "bold"}}>{this.state.registerRes}</p>
                        <div className="footer">
                            <input type="reset" className="btn btn-warning mr-4  btn-lg" value="reset"/>
                            <Button color="primary" size="lg" onClick={this.isValidInfo}>
                                Register
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Register;
