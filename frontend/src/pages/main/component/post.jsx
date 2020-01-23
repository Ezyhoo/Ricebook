import React from "react";
import '../mainPageStyle.css';
import Button from 'react-bootstrap/Button';
import CommentArea from "./commentArea";
import {serverURL} from "../../../url";

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //currentTimeStamp: this.getCurrentTimeStamp(),
            comments: null,
            avatar: null,
            text: this.props.post.body,
            isReadOnly: true,
            btnText: "Edit",
        }

    }

    componentDidMount() {
        this.loadComments();
        this.getAvatar();
    }

    getCurrentTimeStamp = () => {
        return Math.round(new Date() / 1000);
    }

    getImage = () => {
        if(this.props.post.picture === ""){
            return <div/>;
        }
        else{
            return <img className="embeddedPicture" src={this.props.post.picture} alt=""></img>;
        }
    }

    getAvatar = async() => {
        //console.log(this.props.author);
        await fetch(`${serverURL}avatar/${this.props.author}`, {
            method: 'GET',
            credentials : 'include',
        })
            .then(res => res.json())
            .then(data => this.setState({avatar: data.avatar}));
    }

    loadComments = async() => {
        await fetch(`${serverURL}articles/${this.props.post.id}`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => res.json())
            .then(postsArr => this.setState({ comments: postsArr.article[0].comments }))
    }
    changeText = (e) => {
        this.setState({text: e.target.value});
    }
    getEditBtn = () =>{
        //console.log(this.props.logInUser.username);
        if(this.props.logInUser.username === this.props.post.author){
            return <Button type="button" className="btn-warning btn-sm" onClick = {e => this.handleClick(e)}>{this.state.btnText}</Button>
        }
    }
    handleClick = (e) => {
        if(this.state.btnText === 'Edit'){
            this.editArticle();
        }
        else{
            // save
            this.putArticle();


        }
    }

    editArticle = () => {
        //console.log("in edit article")
        this.setState({isReadOnly: false})
        this.setState({btnText: "Save"})
    }
    putArticle = async () =>{
        await fetch(`${serverURL}articles/${this.props.post.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                text: this.state.text,
            })
        })
        this.setState({isReadOnly: true})
        this.setState({btnText: "Edit"})
    }

    render() {
        //console.log("In Post!!!!!");
        if(this.state.comments === null || this.state.avatar === null){
            return <div/>
        }
        //console.log("In comment");


        return (
            <div className="post">
                <div className="post-header">
                    <img className="embeddedAvatar" src={this.state.avatar} alt="avatar"/>{this.props.author}
                    <span style={{float: "right"}}> {new Date(this.props.post.date).toLocaleString()}</span>
                </div>
                <div className="content">
                    <br/>
                    {this.getImage()}
                    <br/>
                    <textarea readOnly={this.state.isReadOnly} className="input" cols="80" rows="5" onChange={e => this.changeText(e)}
                              style={{background: "white", border: 0, boxShadow: "none"}} value={this.state.text}
                    />
                    {this.getEditBtn()}
                    <CommentArea className="commentArea" comments={this.state.comments} articleId = {this.props.post.id}/>
                </div>
            </div>
        );
    }
}

export default Post;
