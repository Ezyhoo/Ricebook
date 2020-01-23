import React from "react";
import Following from "./following";
import Button from 'react-bootstrap/Button';
import '../mainPageStyle.css';


class FollowingList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            followingList: this.props.followingsArr,      // list of following user by username
            message: "",
            input: "",
        }
    }


/*    getFollowingList = async() => {
        await fetch("http://localhost:3000/following", {
            method: 'GET',
            credentials: 'include'})
            .then(res => res.json())
            .then(followingList => this.setState({followingList: followingList.following}));
    }*/


    unfollowUser = (username) => {
        const followingList = this.state.followingList.filter(following => following !== username);
        this.props.handleUnfollow(username);
        this.setState({message: "You unfollowed user: \"" + username + "\""});
        this.setState({followingList});
    }
    addFollowing = () => {
        //console.log(this.props.usersArr);
        let input = this.state.input
        if(input === ""){
            return false;
        }
        let userToAdd = null;
        this.props.usersArr.forEach(user => {
            if (user.username === input) {
                userToAdd = user;
            }
        })

        if(userToAdd === null){
            this.setState({message: "Cannot find user: \"" + input + "\""});
            return false;
        }

        if (this.followingListHas(userToAdd)) {
            this.setState({message: "You have already followed user: \"" + userToAdd.username + "\""});
            return false;
        }
        else if(userToAdd.username === this.props.logInUser.username){
            this.setState({message:"You are always following yourself, " + userToAdd.username});
            return false;
        }
        else{
            this.setState({message: "You are now following user: \"" + input + "\""});
            let followingList = [...this.state.followingList].concat(userToAdd.username);
            this.setState({followingList});

            this.props.handleFollow(userToAdd.username);
            return true;
        }
    }

    followingListHas(user){
        let fl = this.state.followingList;
        for(let i = 0; i < fl.length; i++){
            if(fl[i] === user.username){
                return true;
            }
        }
        return false;
    }

    handleInputChange = (event) =>{
        this.setState({input: event.target.value});
    }

    render() {
        //console.log(this.state.followingList);
        return (
            <div className="followingList">
                <div className="header">Following</div>
                <div className="content">
                    {this.state.followingList.map(following => (
                        <Following key={following} className="following" username={following} handleUnfollow={this.unfollowUser}/>
                    ))}
                </div>
                <p className="message">{this.state.message}</p>
                <div className="footer">
                    <input className="input" placeholder="Enter user's name" onChange={this.handleInputChange}/>
                    <Button type="button" className="btn btn-primary btn-sm mt-2" onClick={this.addFollowing}>Add Following</Button>
                </div>
            </div>
        );
    }
}

export default FollowingList;
