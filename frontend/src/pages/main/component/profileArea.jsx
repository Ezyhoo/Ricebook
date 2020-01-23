import React from "react";
import '../mainPageStyle.css';
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {serverURL} from "../../../url";

class ProfileArea extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            logInUser: this.props.logInUser,
            avatar: "",
            input: "",
        }
    }
    componentDidMount() {
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
    changeStatus = async () => {
        let logInUser = this.state.logInUser
        logInUser.headline = this.state.input;
        this.setState({logInUser});
        await fetch(`${serverURL}headline`, {
            method: 'PUT',
            credentials : 'include',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                headline: this.state.input
            })
        })
        this.setState({input: ""})
        //localStorage.setItem("logInUser", JSON.stringify(logInUser));

        // let usersArr = [...this.props.usersArr];
        // usersArr.forEach(user => {
        //     if (user.username === this.state.logInUser.username) {
        //         user.company.catchPhrase = this.state.input;
        //     }
        // });
        // localStorage.setItem("usersArr", JSON.stringify(usersArr));
    }

    logout = async() =>{
        //localStorage.removeItem("logInUser");
        await fetch(`${serverURL}logout`, {
            method: 'PUT',
            credentials : 'include'
        })
            .then(() => window.location.replace("/"));

    }

    setInput = (event) =>{
        this.setState({input: event.target.value});
}
    render() {
        //console.log(this.state.avatar);
        return(
            <div className="profileArea">
                <div className="header">My Profile</div>
                <div className="content">
                    <div className="image">
                        <img src={this.state.avatar} alt=""></img>
                    </div>
                    <p className="name">{this.state.logInUser.username}</p>
                    <p>{this.state.logInUser.headline}</p>

                    <div className="footer">
                        <input className="statusInput" type="text" placeholder="New Status" onChange={this.setInput} value={this.state.input}></input>
                        <Button type="button" className="btn btn-primary btn-sm ml-2" onClick={this.changeStatus}>Change Status</Button>
                        <Link to="/profile">
                            <Button type="button" className="btn btn-primary btn-lg mr-3">Profile</Button>
                        </Link>
                        <Button type="button" id="log-out" className="btn btn-warning btn-lg ml-3" onClick={this.logout}>Log Out</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileArea;
