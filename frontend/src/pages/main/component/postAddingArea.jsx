import React from "react";
import '../mainPageStyle.css';
import Button from 'react-bootstrap/Button';
import {serverURL} from "../../../url";

class PostAddingArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myPost: "",
            image: "",
            imageButtonText: "Add Image"
        }
    }

    getImage = () => {
        //console.log(this.state.image);
        if(this.state.image === ''){
            return <div/>
        }
        else{
            return <img className="embeddedImage" src={this.state.image} alt=""></img>;
        }
    }

    setImage = async(event) => {
        //console.log(event.target.files[0])
        const image = event.target.files[0];
        let fd = new FormData();
        fd.append('image', image);
        await fetch(`${serverURL}new-image`, {
            method: "POST",
            credentials: "include",
            body: fd
        })
            .then(res => res.json())
            .then(data => this.setState({image: data.image}));
        this.setState({imageButtonText: "Change Image"});
    }
    clear = () => {
        this.setState({myPost: ""});
        this.setState({image: ""});
        this.setState({imageButtonText: "Add Image"});
    }

    setMyPost = (event) => {
        this.setState({myPost: event.target.value});
    }

    post = () =>{
        const myPost = this.state.myPost;
        const myImage = this.state.image;
        this.clear();
        if(myPost.length === 0){
            return;
        }
        let post = {text: myPost, image: myImage};
        this.props.newPost(post);
        this.setState({myPost: ""});
    }

    render() {
        return (
            <div className="postAddingArea">
                <div className="header">Add Post</div>
                <div className="content">
                    <div style={{display: "inline"}}>
                        {this.getImage()}
                        <textarea className="input" id="input" style={{display: "inline"}} cols="50" rows="5" onChange={this.setMyPost}
                                  placeholder="Share something with your friends" value={this.state.myPost}></textarea>
                    </div>
                    <br/>
                    <label className="btn btn-primary btn-file btn-sm mt-2">
                        {this.state.imageButtonText}
                        <input type="file" accept="image/*" onChange={(e) => this.setImage(e)} style={{display: "none"}}>
                        </input>
                    </label>

                    <div className="footer">
                        <Button className="btn btn-warning btn-lg mr-3" onClick={this.clear}>Clear
                        </Button>
                        <Button className="btn btn-primary btn-lg ml-3" onClick={this.post}>Post</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PostAddingArea;
