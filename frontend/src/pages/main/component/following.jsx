import React from "react";
import '../mainPageStyle.css';
import Button from 'react-bootstrap/Button';
import {serverURL} from "../../../url";

class Following extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            headline: '',
            avatar: '',
        }
    }
    componentDidMount() {
        this.getHeadline();
        this.getAvatar();
    }

    getAvatar = async() => {
        //console.log(this.props.author);
        await fetch(`${serverURL}avatar/${this.props.username}`, {
            method: 'GET',
            credentials : 'include',
        })
            .then(res => res.json())
            .then(data => this.setState({avatar: data.avatar}));
    }

    getHeadline = async() => {
        //console.log(this.props.username);
        await fetch(`${serverURL}headline/${this.props.username}`,{
            method: 'GET',
            credentials : 'include'})
            .then(res => res.json())
            .then(data => this.setState({headline: data.headline}));
    }
    render() {

        return(
            <div className="following">
                <div className="content">
                    <div className="image">
                        <img src={this.state.avatar} alt="random profile"></img>
                    </div>
                    <p className="name">{this.props.username}</p>
                    <p>{this.state.headline}</p>
                    <Button type="button" variant="outline-secondary btn-sm" onClick={() => this.props.handleUnfollow(this.props.username)}>Unfollow</Button>
                </div>
            </div>
        );
    }
}

export default Following;
