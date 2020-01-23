import React from "react";
import '../mainPageStyle.css';
import {serverURL} from "../../../url";

class CommentArea extends React.Component {


    constructor(props) {
        super(props);
        //this.moreComments = React.createRef();
        this.state=
        {
            allComments: this.props.comments,
            displayComments: [],
            moreComments: "",
            comment: "",
            avatar: "",
        }
        //console.log(props.comments);
        //this.comments = ["I like it!", "Good Job", "What a wonderful post!", "Wow!!!! Just Wow!!!", "You really like this kinda stuff, dont you?", "This makes me laugh so hard, lol", "我在学中文"];
        //this.name = ["Alice", "Bobby", "Cindy", "Dave", "Ellen", "Florence", "Gloria", "Harrison", "Ivy"]

    }

    componentDidMount(){
        this.build();
        //this.getAvatar();
    }

    componentWillReceiveProps() {
        this.build();
    }


    build = () => {
        let allComments = this.state.allComments;
        //console.log(this.state.allComments);
        //this.setState({allComments});
        let displayComments = [];
        for(let i = 0; i < 2 && i < allComments.length; i++){
            displayComments[i] = allComments[i];
            //console.log(displayComments);
        }
        this.setState({displayComments})
    }

    showAllComments = () =>{
        this.setState({moreComments: ""});
        this.setState({displayComments: [...this.state.allComments]});
    }
    getAvatar = async(username) => {
        //console.log(this.props.author);
        await fetch(`${serverURL}avatar/${username}`, {
            method: 'GET',
            credentials : 'include',
        })
            .then(res => res.json())
            .then(data => this.setState({avatar: data.avatar}));
    }
    getComments = () =>{
        //console.log(this.props.comments);
            return(
                <div>
                    {this.state.displayComments.map((comment, i) => (
                        <div className="comment"  key = {i}>{
                            <p style={{color: "blue", fontWeight: "bold", display: "inline"}}>{comment.author}: </p>
                        } {comment.body}
                        </div>
                        ))}
                </div>
            )

    }

    getMoreCommentOpt = () =>{
        if(this.state.allComments.length > this.state.displayComments.length ){
            return <button className="more-comment" onClick={this.showAllComments}>See {this.state.allComments.length-2} more comments</button>
        }
    }
    getComment = () =>{
        return this.comments[Math.floor(Math.random() * this.comments.length )];
    }

    getName = () =>{
        return this.name[Math.floor(Math.random() * this.name.length)];
    }

    getNumOfComments = () => {
        return Math.floor(Math.random() * 6 + 1);
    }


    setComment = (e) => {
        const comment = e.target.value;
        this.setState({comment});

    }

    postComment = async() => {
        if (this.state.comment === '') {
            return;
        }
        const comment = this.state.comment;
        this.setState({comment: ""});
        await fetch(`${serverURL}articles/${this.props.articleId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                text: comment,
                commentId: -1,
            })
        })
            .then(res => res.json())
            .then(data => this.setState({allComments: data.article[0].comments}))
            .then(() => this.build())
    }

    render() {
        //console.log(this.props.articleId);
        //this.build();
        return (
            <div>
                <h3 className= "commentHeader">Comments-{this.state.allComments.length}</h3>
                {this.getComments()}
                {this.getMoreCommentOpt()}
                <div className="footer" style={{display: "inline-block"}}>
                    <textarea className="commentBox" id="input" style={{display: "inline"}} cols="65" rows="2"
                              placeholder="Leave a comment" onChange={e => this.setComment(e)} value={this.state.comment}>
                    </textarea>
                    <button style={{marginTop: "-2em"}} className="btn btn-primary btn-lg mr-3" onClick={this.postComment}>Comment</button>
                </div>
            </div>
        );
    }
}

export default CommentArea;
