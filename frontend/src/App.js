import React from "react";
import Landing from "./pages/landing/landing";
import Main from "./pages/main/main";
import Profile from "./pages/profile/profile";
import "./App.css";
import {serverURL} from "./url"

import {BrowserRouter as Router, Switch, Route} from "react-router-dom";


class App extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            usersArr: [],    // all the users
            logInUser: {},
            postsArr:[],    // all the posts
        };


    }

    componentDidMount() {
        this.addUsers();
        //this.addProfiles();
        //this.addPosts();
    }

    addUsers = async () => {
        await fetch(`${serverURL}users`)
            .then(response => response.json())
            .then(data => this.setState({usersArr: data.users}))
    }



    // addPosts = () => {
    //     fetch('https://jsonplaceholder.typicode.com/posts')
    //         .then(response => response.json())
    //         .then(postsArr => this.setState({postsArr}))
    // }

    render() {
        if(this.state.usersArr.length === 0){
            return <div />
        }
        return (
            <div>
                <Router>
                    <div>
                        <Switch>
                            <Route path="/main" exact render={() => <Main usersArr={this.state.usersArr}  postsArr={this.state.postsArr}/>}/>
                            <Route path="/profile" exact render={()=><Profile />}></Route>
                            <Route path="" exact render={() => <Landing usersArr = {this.state.usersArr}/>}></Route>
                        </Switch>
                    </div>
                </Router>
                <br/>
                <br/>
            </div>
        );
    }
}


export default App;
