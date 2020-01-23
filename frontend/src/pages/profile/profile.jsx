import React, {Component} from "react";
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import "./profieStyle.css";
import {serverURL} from "../../url"

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logInUser: "",
            name: "",
            email: "",
            phoneNum: "",
            zipcode: "",
            password: "",
            passwordConfirmation: "",
            avatar: "",

            nameRes: "",
            emailRes: "",
            phoneNumRes: "",
            zipcodeRes: "",
            passwordRes: "",
        }
    }

    componentDidMount() {
        this.getLoggedInUser();
        this.getAvatar();
    }

    getAvatar = async() => {
        await fetch(`${serverURL}avatar`, {
            method: 'GET',
            credentials : 'include',
        })
            .then(res => res.json())
            .then(data => this.setState({avatar: data.avatar}));
    }

    getLoggedInUser = async() => {
        await fetch(`${serverURL}loggedInUser`,{
            method: 'GET',
            credentials : 'include'})
            .then(res => res.json())
            .then(logInUser => this.setState({logInUser}))
        //.then(() => console.log(this.state.logInUser));
    }

    setName = (e) =>{
        this.setState({name: e.target.value});
    }

    setEmail = (e) =>{
        this.setState({email: e.target.value});
    }

    setPhoneNum = (e) =>{
        this.setState({phoneNum: e.target.value});
    }

    setZipcode = (e) =>{
        this.setState({zipcode: e.target.value});
    }


    setPassword = (e) =>{
        this.setState({password: e.target.value});
    }

    setPasswordC = (e) =>{
        this.setState({passwordConfirmation: e.target.value});
    }

    getPasswordInStar = () => {
        let stars = "***";
        return stars;
    }

    infoSubmit = () => {
        if(!this.validateInfo()){
            return false;
        }
        this.updateAvatar();
        this.updateInfo();
        return true;
    }

    validateInfo(){
        //let isValidEmail = this.validateEmail();
        let isValidPhoneNum = this.validatePhoneNum();
        let isValidZipcode = this.validateZipcode();
        let isValidPassword = this.validatePassword();
        let res = isValidPhoneNum && isValidZipcode && isValidPassword;
        if(res){
            return true;
        }
        else {
            return false;
        }
    }

    validateEmail(){
        let email = this.state.email;
        if(email === "" || /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)){
            this.setState({emailRes: ""});
            return true;
        }
        else{
            this.setState({emailRes: "Please enter an valid email"});
            return false;
        }
    }

    validatePhoneNum(){
        let phoneNum = this.state.phoneNum;
        if(phoneNum === "" || /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phoneNum)){
            this.setState({phoneNumRes: ""});
            return true;
        }
        else{
            this.setState({phoneNumRes: "Please follow the format: XXX-XXX-XXXX"});
            return false;
        }
    }
    validateZipcode(){
        let zipcode = this.state.zipcode;
        if(zipcode === "" || zipcode.length === 5){
            this.setState({zipcodeRes: ""});
            return true;
        }
        else{
            this.setState({zipcodeRes: "A zipcode is 5 digits"});
            return false;
        }
    }

    validatePassword() {
        let password = this.state.password;
        let passwordConfirmation = this.state.passwordConfirmation;
        if ((password === "" && passwordConfirmation === "")) {
            this.setState({passwordRes: ""});
            return true;
        }
        if (password === passwordConfirmation) {
            this.setState({passwordRes: ""});
            return true;
        } else {
            this.setState({passwordRes: "Password does not match!"});
            return false;
        }
    }

    updateInfo() {
        let curDisplayName = this.state.name;
        let curEmail = this.state.email;
        let curPhoneNum = this.state.phoneNum;
        let curZipcode = this.state.zipcode;
        let curPassword = this.state.password;


        let logInUser = JSON.parse(JSON.stringify(this.state.logInUser));


        if (curDisplayName !== "") {
            logInUser.name = curDisplayName;
            this.setState({name: ""});
        }
        if (curEmail !== "") {
            logInUser.email = curEmail;
            this.updateEmail();
            this.setState({email: ""});
        }
        if (curPhoneNum !== "") {
            logInUser.phone = curPhoneNum;
            this.setState({phoneNum: ""});
        }
        if (curZipcode !== "") {
            logInUser.zipcode = curZipcode;
            this.updateZipcode();
            this.setState({zipcode: ""});
        }
        if (curPassword !== "") {
            //logInUser.password = curPassword;
            //console.log(logInUser.address.street);
            this.updatePassword();
            this.setState({password: ""});
            this.setState({passwordConfirmation: ""});
        }

        this.setState({logInUser});
    }

    updateEmail = async () => {
        await fetch(`${serverURL}email/`, {
            method: "PUT",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: this.state.email
            })
        })
    }

    updateZipcode = async () => {
        await fetch(`${serverURL}zipcode`, {
            method: "PUT",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                zipcode: this.state.zipcode,
            })
        })

    }

    updatePassword = async () => {
        await fetch(`${serverURL}password`, {
            method: "PUT",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                password: this.state.password,
            })
        })


    }

    tryNewAvatar = async (event) => {
        //console.log(event.target.files[0]);
        const avatar = event.target.files[0];
        let fd = new FormData();
        fd.append('avatar', avatar);
        await fetch(`${serverURL}new-avatar`, {
            method: "POST",
            credentials: "include",
            body: fd
        })
            .then(res => res.json())
            .then(data => this.setState({avatar: data.image}));
    }

    updateAvatar = async (event) => {
        await fetch(`${serverURL}avatar`, {
            method: "PUT",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                avatar: this.state.avatar,
            })
        })
            .then(res => res.json())
            .then(data => this.setState({avatar: data.avatar}));
    }

    linkAccount = async() => {
        await fetch(`${serverURL}link`, {
            method: "PUT",
            credentials: "include",
        })
            .then(window.location.replace(`${serverURL}auth/google`))
    }




    render() {
        if(this.state.logInUser === null){
            window.location.replace("/");
        }
        return (
            <React.Fragment>
                <div className="textAlignLeft">
                    <Link to="/main">
                        <Button type="button" className="btn btn-primary">Back to Main Page</Button>
                    </Link>
                    <br/>
                    <h1>Profile Page</h1>
                    <br/>
                    <h2>Profile Information</h2>
                    <br/>
                    <Button className="btn btn-warning btn-lg" onClick={this.linkAccount}>Link Account</Button>
                    <br/>
                    <br/>
                    <div className="profile-info">
                        <div>
                            <img className="profile" src={this.state.avatar} alt="profile"></img>
                            <label className="btn btn-outline-light btn-file btn-sm ml-4" >
                                Change Profile
                                <input type="file" accept="image/*" name = "avatar" onChange={(e) => this.tryNewAvatar(e)}  style={{display: "none"}}/>
                            </label>
                        </div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Information Name</th>
                                <th>New Info</th>
                                <th>Current Info</th>
                                <th>Response</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="info-name-col">Display name</td>
                                <td className="text-box-col"><input type="text" onChange={this.setName} value = {this.state.name}/>
                                </td>
                                <td className="pre-info-col">{this.state.logInUser.name}</td>
                                <td className="response-col"><p></p></td>
                            </tr>
                            <tr>
                                <td className="info-name-col">Email address</td>
                                <td className="text-box-col"><input type="email" onChange={this.setEmail} value = {this.state.email}
                                                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" />
                                </td>
                                <td className="pre-info-col">{this.state.logInUser.email}</td>
                                <td className="response-col"><p style={{color: "red", fontWeight: "bold"}}>{this.state.emailRes}</p></td>
                            </tr>
                            <tr>
                                <td className="info-name-col">Phone number</td>
                                <td className="text-box-col"><input type="tel" onChange={this.setPhoneNum} value = {this.state.phoneNum}
                                                                    pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'/></td>
                                <td className="pre-info-col">{this.state.logInUser.phone}</td>
                                <td className="response-col"><p style={{color: "red", fontWeight: "bold"}}>{this.state.phoneNumRes}</p></td>
                            </tr>
                            <tr>
                                <td className="info-name-col">Zipcode</td>
                                <td className="text-box-col"><input type="number" onChange={this.setZipcode} value = {this.state.zipcode}/></td>
                                <td className="pre-info-col">{this.state.logInUser.zipcode}</td>
                                <td className="response-col"><p style={{color: "red", fontWeight: "bold"}}>{this.state.zipcodeRes}</p></td>
                            </tr>

                            <tr>
                                <td className="info-name-col">Password</td>
                                <td className="text-box-col"><input type="password" onChange={this.setPassword} value = {this.state.password}/></td>
                                <td className="pre-info-col" >{this.getPasswordInStar()}</td>
                                <td className="response-col"><p style={{color: "red", fontWeight: "bold"}}>{this.state.passwordRes}</p></td>
                            </tr>
                            <tr>
                                <td className="info-name-col">Password confirmation</td>
                                <td className="text-box-col"><input type="password" onChange={this.setPasswordC} value = {this.state.passwordConfirmation}/>
                                </td>
                                <td className="pre-info-col" >{this.getPasswordInStar()}</td>
                                <td className="response-col"></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="row justify-content-center">
                            <Button className="btn btn-primary btn-lg mt-4" onClick={this.infoSubmit}>Submit Changes</Button>
                        </div>
                        <br/><br/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Profile;
