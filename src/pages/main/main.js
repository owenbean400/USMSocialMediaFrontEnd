import React, { useCallback, useEffect, useState } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Post from "../../components/posts/post";
import SideSection from "../../components/sideMenu/sideSection";
import styles from "./main.module.css";
import NavBar from "../../components/nav/navbar";

function Main() {
    const [token, setToken] = useState('');
    const [firstFetchDateTime, setFirstFetchDataTime] = useState("");
    const [lastNewPostFetch, setLastNewPostFetch] = useState("");
    const [newPostsCount, setNewPostsCount] = useState(0);
    const [createPostContent, setCreatePostContent] = useState("");
    const [posts, setPosts] = useState(useSelector(state => state.posts) || []);
    const [pageFetch, setPageFetch] = useState(1);
    const [morePosts, setMorePosts] = useState(true);
    const navigate = useNavigate();

    console.log("test");
    console.log(useSelector(state => state.posts))
    console.log(posts);

    const getNewPostsCounts = useCallback(async (lastDateFetch) => {
        if (lastDateFetch === "") {
            return;
        }

        const URL = ConnectConfig.api_server.url + "/api/v1/post/new/fetch/recommended?lastFetchDateTime=" + lastDateFetch;

        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                let data = await response.json();
                setNewPostsCount(data.body.amountOfNewPost);
            }
        } catch (error) {

        }
    }, [token]);

    async function getNewPosts(lastDateFetch) {

        const URL = ConnectConfig.api_server.url + "/api/v1/post/new/recommended?lastFetchDateTime=" + lastDateFetch;
    
        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                let data = await response.json();
                setLastNewPostFetch(data.body.serverDateTime);
                setPosts(prevPosts => [...data.body.posts, ...prevPosts]);
                setNewPostsCount(0);
            }
        } catch (error) {

        }
    }

    async function getPosts(pageNumber, date) {
        
        if (posts.length === 0) {
            setPageFetch(0);
        }

        const URL = ConnectConfig.api_server.url + "/api/v1/post/recommended?pageNumber=" + pageNumber + "&datetime=" + date + "&pageSize=10";
        
        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                let data = await response.json();
                setPosts(prevPosts => [...prevPosts, ...data.body.pageResult.content]);
                if (data.body.pageResult.content.length > 0) {
                    setPageFetch(prevPageFetch => prevPageFetch + 1);
                    console.log(data);
                    setFirstFetchDataTime(data.body.dateTimeFetch);
                } else {
                    setMorePosts(false);
                }
            } else if (response.status === 401) {
                navigate("/");
            }
        } catch (error) {

        }
    }

    const getFirstPosts = useCallback(async () => {
        const URL = ConnectConfig.api_server.url + "/api/v1/post/recommended?pageNumber=0&pageSize=10";

        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                let data = await response.json();
                
                setPosts(data.body.pageResult.content);
                setFirstFetchDataTime(data.body.dateTimeFetch);
                setLastNewPostFetch(data.body.dateTimeFetch);

                navigate('/main');
            } else if (response.status === 401) {
                navigate("/");
            }
        } catch (error) {
        }
    }, [navigate, token]);

    useEffect(() => {
        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        } else {
            navigate('/');
        }

        async function apiRequests() {
            if (posts.length === 0) {
                await getFirstPosts();
            }
        }

        apiRequests();

        const interval = setInterval(() => {
            getNewPostsCounts(lastNewPostFetch);
        }, 15000);

        return () => clearInterval(interval);

    }, [getFirstPosts, getNewPostsCounts, lastNewPostFetch, navigate, posts.length]);

    async function createPost() {
        const URL = ConnectConfig.api_server.url + "/api/v1/post/create";

        try {
            let post = {
                content: createPostContent
            }

            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post)
            });

            if (response.ok) {
                setCreatePostContent('');
                getNewPosts(lastNewPostFetch);
            } else {
            }
        } catch (error) {
            console.log("Error")
        }
    }

    return(
        <div>
            <NavBar />
            <div className={styles.mainContainer}>
                <div className={styles.mainContainerInside}>
                    <div className={styles.sidemenu}>
                        <div className={styles.sidemenuInside}>
                            <SideSection 
                                header="Groups"
                                items={[]}
                            />
                            <SideSection 
                                header="Classes"
                                items={[]}
                            />
                        </div>
                    </div>
                    <div className={styles.postsContainer}>
                        <div className={styles.newPostContainer}>
                            <div className={styles.newPostImage}></div>
                            <input className={styles.newPostTextFieldInput} type="text" onChange={(e) => setCreatePostContent(e.target.value)} value={createPostContent}/>
                            <p onClick={() => createPost()} className={styles.postClick}>Post</p>
                        </div>
                        {
                            (newPostsCount > 0) ?
                            <div className={styles.morePostContainer} onClick={() => getNewPosts(lastNewPostFetch)}>
                                <p>{newPostsCount} New Posts Awaiting</p>
                            </div> : <div></div>
                        }
                        {posts.map((post, index) => (
                            <Post
                                key={index}
                                id={post.postUserInfo.id}
                                name={post.postUserInfo.firstName + " " + post.postUserInfo.lastName}
                                title={post.title}
                                content={post.content}
                                likes={post.likeCount}
                                comments={post.comments || []}
                            ></Post>
                        ))}
                        {
                            (morePosts) ?
                            <div className={styles.morePostContainer} onClick={() => getPosts(pageFetch, firstFetchDateTime)}>
                                <p>More Posts</p>
                            </div>
                            : 
                            <div className={styles.noMorePostContainer}>
                                <p>No More Posts</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
