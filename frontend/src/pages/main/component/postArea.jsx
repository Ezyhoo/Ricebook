import React from "react";
import Post from "./post";
import "../mainPageStyle.css";
import PostAddingArea from "./postAddingArea";
import {serverURL} from "../../../url";

class PostArea extends React.Component {
  constructor(props) {
    super(props);
    //this.input = React.createRef();
    this.state = {
      allPosts: null,
      posts: [],
      myPosts: [],
      followingsArr: [],
      input: ""
    };
  }
  static getDerivedStateFromProps(nextPros, prevState) {
    //console.log(nextPros.postsArr, prevState.allPosts);
    if (JSON.stringify(nextPros.postsArr) !== JSON.stringify(prevState.allPosts)) {
      return {
        posts: nextPros.postsArr,
        allPosts: nextPros.postsArr
      };
    }
    return null;
  }

  componentDidMount() {
    //this.getFollowingArrs();
    this.getPosts();
  }

/*componentDidUpdate(prePros) {
    //console.log(2);
  console.log(prePros);
  console.log(this.props.followingsArr);
  if (JSON.stringify(prePros.followingsArr) !== JSON.stringify(this.props.followingsArr)) {
    //console.log("true");
    this.setState({followingsArr: this.props.followingsArr},()=>
      this.getPosts()
    )
  }
}*/


/*getFollowingArrs = async() => {
    await fetch("http://localhost:3000/following", {
      method: 'GET',
      credentials: 'include'})
        .then(res => res.json())
        .then(followingsArr => this.setState({followingsArr: followingsArr.following},
            () => console.log(this.state.followingsArr)));
  }*/


  async getPosts() {
        //this.getFollowingArrs();
        await fetch(`${serverURL}articles`, {
          method: 'GET',
          credentials: 'include'
        })
            .then(res => res.json())
            .then(data => this.setState({allPosts: data.articles}))
            .then(() => this.setState({posts: this.state.allPosts}));
  }

  /*updatePosts() {
    const postsArr = this.props.postsArr;
    let allPosts = [...this.state.myPosts];
    /!*for (let i = 0; i < postsArr.length; i++) {
      if (this.state.followingsArr.includes(postsArr[i].userId)) {
        allPosts = [postsArr[i]].concat(allPosts);
        //console.log(allPosts);
      }
    }*!/
    this.setState({ allPosts }, () =>
      this.setState({ posts: JSON.parse(JSON.stringify(this.state.allPosts)) })
    );
    // JSON.parse(JSON.stringify for copying
  }*/

  /*getAuthorById = id => {
    let author;
    const usersArr = this.props.usersArr;
    for (let i = 0; i < usersArr.length; i++) {
      if (usersArr[i].id === id) {
        author = usersArr[i].name;
        break;
      }
    }
    return author;
  };*/


  searchPost = event => {
    //console.log("called");
    this.setState({ input: event.target.value }, () => {
      const keyWord = this.state.input;
      if (keyWord.length === 0 || keyWord === " ") {
        let posts = JSON.parse(JSON.stringify(this.state.allPosts));
        this.setState({ posts });
        return;
      }
      let allPosts = this.state.allPosts;
      let newPosts = [];
      for (let i = 0; i < allPosts.length; i++) {
        if (allPosts[i].body.includes(keyWord) || allPosts[i].author.includes(keyWord)) {
          newPosts.push(allPosts[i]);
        }
      }
      this.setState({ posts: newPosts });
    });
  };

  render() {
    //console.log(this.state.posts);
    return (
      <div>
        <PostAddingArea
          logInUser={this.props.logInUser}
          newPost={this.props.addNewPost}
        />
        <div className="postArea">
          <input
            className="searchBar"
            placeholder="Search Posts Content"
            onChange={this.searchPost}
          />
          <div className="content">
            {/*{JSON.stringify(this.state.posts)}*/}
            {this.state.posts.map(post => (
              <Post key={post.id} author={post.author} post={post} logInUser={this.props.logInUser}/>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default PostArea;
