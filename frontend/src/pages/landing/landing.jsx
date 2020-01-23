import React, {Component} from 'react';
import Login from "./component/login"
import "./landingStyle.css";
import Register from "./component/register";
import {serverURL} from "../../url"

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logInUser: 0,
            isLoginActive: true,
        }
    }

    componentDidMount() {
        this.getLoggedInUser()
        this.rightSide.classList.add("right");
    }

    getLoggedInUser = async() => {
        await fetch(`${serverURL}loggedInUser`,{
            method: 'GET',
            credentials : 'include'})
            .then(res => res.json())
            .then(logInUser => this.setState({logInUser}))
            .then(() => {
                if(this.state.logInUser !== null){
                    window.location.replace("/main")
                }
            })
    }

    changeState() {
        const {isLoginActive} = this.state;
        if (isLoginActive) {
            this.rightSide.classList.remove("right");
            this.rightSide.classList.add("left");
        } else {
            this.rightSide.classList.remove("left");
            this.rightSide.classList.add("right");
        }

        this.setState((prevState) => ({isLoginActive: !prevState.isLoginActive}))
    }

    render() {
        const {isLoginActive} = this.state;
        const current = isLoginActive ? "Register" : "Login";
        const currentActive = isLoginActive ? "Login" : "Register";
        return (
            <div>
                <h1>Landing Page</h1>
                <div className="landing">
                    <div className="login">
                        <div className="container" ref={ref => (this.containerRef = ref)}>
                            {isLoginActive && (<Login usersArr={this.props.usersArr} containerRef={(ref) => this.current = ref}/>)}
                            {!isLoginActive && (<Register usersArr={this.props.usersArr} containerRef={(ref) => this.current = ref}/>)}
                        </div>
                        <LeftSide current={current} containerRef={ref => this.rightSide = ref}
                                   currentActive={{currentActive}}
                                   onClick={this.changeState.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}

const LeftSide = props => {
    return (<div className="right-side" ref={props.containerRef} onClick={props.onClick}>
        <div className="inner-container">
            <div className="text">{props.current}</div>
        </div>
    </div>);
};

export default Landing;
