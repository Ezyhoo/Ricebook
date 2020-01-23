import React, {Component} from "react";
import ricebookLogo from "../../../logo.jpg";
import {Redirect} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import "../landingStyle.css";
import {serverURL} from "../../../url";

class Login extends Component {
    googleAuthURL = `${serverURL}auth/google`;
    constructor(props){
        super(props);

        this.state = {
            username: "",
            password: "",
            message: "",
            googleClientID: "",
            toMainPage: false,
        }

    }

    componentDidMount() {
        //this.getGoogleClientID();

    }

    getGoogleClientID = async () => {
        await fetch(`${serverURL}google-client-ID`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => this.setState({googleClientID: data.key}))
    }

    handleUsername = (event) => {
        this.setState({username: event.target.value});
    }
    
    handlePassword = (event) => {
        this.setState({password: event.target.value});
    }
    
    validateLogin = (event) => {
        //btn.preventDefault();
        let username = this.state.username;
        let password = this.state.password;
        //let usersArr = this.props.usersArr;
        if (username === "" || password === "") {
            this.setState({message: "Username or password cannot be empty!"});
            event.preventDefault();
            return false;
        }

        fetch(`${serverURL}login`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
            .then(res => {
                if (res.status === 200) {
                    this.setState({toMainPage: true});
                }
                //event.preventDefault();
                this.setState({message: "Username and password does not match!"});
                return false;

                //console.log(res.status);
            });
        // usersArr.forEach(user => {
        //     if(user.username === username && user.address.street === password){
        //         found = true;
        //         localStorage.setItem("logInUser", JSON.stringify(user));
        //         //console.log(user);
        //         //console.log(JSON.parse(localStorage.getItem("logInUser")));
        //         return true;
        //     }
        // })

    }

/*    googleLogIn = async (event) =>{
        event.preventDefault();
        await fetch(`${serverURL}google`, {
            method: 'GET',
            credentials: 'include',
        })

    }*/


    render() {
/*        if(this.state.googleClientID === ""){
            return <div/>
        }*/
        if(this.state.toMainPage === true) {
            return <Redirect to='/main'/>
        }
        return (
            <div className="main-container" ref={this.props.containerRef}>
                <div className="header">Login</div>
                <div className="content">
                    <div className="smallLogo">
                        <img src={ricebookLogo} alt="login"/>
                    </div>

                    <form className="form">
                        <div className="form-group">
                            <label htmlFor="username">UserName</label>
                            <input type="text" id="username" placeholder="username" onBlur={this.handleUsername} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="password" onBlur={this.handlePassword} required/>
                        </div>
                        <p style={{color: "red", fontWeight: "bold"}}>{this.state.message}</p>
                        <div className="footer">
                                <Button color="primary" size="lg" onClick={event => this.validateLogin(event)}>
                                    Log In
                                </Button>
                            <br/>
                            <br/>
                            <a //onClick={(e) => this.googleLogIn(e)}
                               href={this.googleAuthURL}><img className='third-party-icon' alt ="google-sign-in" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvJeYuNztSGMiZQSQKsj_7n82Bec6PQCGIXxpyvOAWY8Il8qcrYA&s'></img></a>
                            {/*<GoogleLogin
                                clientId={this.state.googleClientID}
                                buttonText="Login with Google"
                                onSuccess={this.googleLogIn}
                                onFailure={this.googleLogInFailure}
                                cookiePolicy={'single_host_origin'}
                            />*/}
                        </div>
                        <br/>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
