import React, {Component} from 'react';
import ProfileArea from "./component/profileArea";
import ricebookLogo from "../../logo.jpg"
import FollowingList from "./component/followingList";
import PostArea from "./component/postArea";
import {serverURL} from "../../url"

class Main extends Component {


    constructor(props){
        super(props);
        this.state = {
            logInUser: 0,
            usersArr: null,
            followingsArr: null,
            postsArr: null,
        }

    }

      componentDidMount(){
          this.getLoggedInUser().then(

            this.getUsersArr(),
            this.getFollowingsArr(),
            this.getPostsArr(),
          );
     }
    putNewFollowing = async username => {
        //console.log(username);
        this.setState({followingsArr: [...this.state.followingsArr, username]})
        await fetch(`${serverURL}following/${username}`, {
            method: "PUT",
            credentials: "include",
        })
            .then(async () => await fetch(`${serverURL}articles`,{
                method: "GET",
                credentials: "include",
            })
            .then(res => res.json())
            .then(data => this.setState({postsArr: data.articles}))
            )

    }


    deleteFollowing = async username => {
        let followingsArr = [...this.state.followingsArr];
        followingsArr = this.state.followingsArr.filter(following => following !== username);
        this.setState({followingsArr});
        await fetch(`${serverURL}following/${username}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then(async () => await fetch(`${serverURL}articles`, {
                method: "GET",
                credentials: "include",
            })
            .then(res => res.json())
            .then(data => this.setState({postsArr: data.articles}))
            )
    }



    getUsersArr = async() => {
        await fetch(`${serverURL}users`,{
            method: 'GET',
            credentials : 'include'})
            .then(res => res.json())
            .then(usersArr => this.setState({usersArr: usersArr.users}))
            //.then(() => console.log(this.state.usersArr));

    }

    getLoggedInUser = async() => {
        await fetch(`${serverURL}loggedInUser`,{
        method: 'GET', 
        credentials : 'include'})
        .then(res => res.json())
        .then(logInUser => this.setState({logInUser}))
        //.then(() => this.setState({followingsArr: this.state.logInUser.following}))
        //.then(() => console.log(this.state.logInUser));
    }

    getFollowingsArr = async() => {
        //console.log("in getFollowingsArr");
        await fetch(`${serverURL}following`,{
            method: 'GET',
            credentials : 'include'})
            .then(res => res.json())
            .then(data => this.setState({followingsArr: data.following}))
            //.then(() => console.log(this.state.followingsArr));
    }

    getPostsArr = async() => {
        await fetch(`${serverURL}articles`, {
            method: 'GET',
            credentials: 'include'})
        .then(res => res.json())
        .then(data => this.setState({postsArr: data.articles}))

        //.then(postsArr => this.setState({postsArr}))
        //.then(console.log(this.state.postsArr))
    }

    addNewPost = async post => {
        // let allPosts = this.state.allPosts;
        // let posts = this.state.posts;
        // let myPosts = this.state.myPosts;
        // allPosts = [post].concat(allPosts);
        // posts = [post].concat(posts);
        // myPosts = [post].concat(myPosts);
        //console.log(post.text);
        await fetch(`${serverURL}articles/`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: post.text,
                image: post.image
            })
        }).then(() => this.getPostsArr())


        // this.setState({allPosts});
        // this.setState({posts});
        // this.setState({myPosts});
    };


    render() {
        // check if the logInUser is still a promise
        //console.log(this.state.logInUser);
        if(this.state.logInUser === null){
            window.location.replace('/');
        }
        if(this.state.logInUser === 0
    || this.state.postsArr === null
            || this.state.usersArr === null
            || this.state.followingsArr === null){
            return <div/>;
        }

        //console.log(this.state.logInUser);
        //console.log("The login user is " + this.state.logInUser.username);
        //console.log(this.state.postsArr);
        //console.log(this.state.followingsArr);
        return (
            <div>
                <h1>Main Page</h1>
                <img className="bigLogo" src={ricebookLogo} alt=""/>
                <ProfileArea logInUser={this.state.logInUser}/>
                <FollowingList logInUser={this.state.logInUser} usersArr = {this.state.usersArr} followingsArr = {this.state.followingsArr} handleFollow = {this.putNewFollowing} handleUnfollow = {this.deleteFollowing}/>
                <PostArea logInUser={this.state.logInUser} postsArr = {this.state.postsArr} followingsArr = {this.state.followingsArr } addNewPost = {this.addNewPost}/>
            </div>

        )
    }
}

export default Main;
