import React, { useCallback, useEffect, useState } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSelector } from 'react-redux';
import Post from "../../components/posts/post";
import SideSection from "../../components/sideMenu/sideSection";
import styles from "./main.module.css";
import { getApiCall, postApiCall } from "../../helper/global";
import { DEFAULT_URL_LOGO } from "../../helper/global";

function Main() {
    const [profilePicture] = useOutletContext();
    const [token, setToken] = useState('');
    const [firstFetchDateTime, setFirstFetchDataTime] = useState("");
    const [lastNewPostFetch, setLastNewPostFetch] = useState("");
    const [newPostsCount, setNewPostsCount] = useState(0);
    const [createPostContent, setCreatePostContent] = useState("");
    const [posts, setPosts] = useState(useSelector(state => state.posts) || []);
    const [pageFetch, setPageFetch] = useState(1);
    const [morePosts, setMorePosts] = useState(true);
    const navigate = useNavigate();

    const getNewPostsCounts = useCallback(async (lastDateFetch) => {
        if (lastDateFetch === "") {
            return;
        }

        const URL_ADD = "/api/v1/post/new/fetch/recommended?lastFetchDateTime=" + lastDateFetch;
        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            setNewPostsCount(data.body.amountOfNewPost);
        }

    }, [token, navigate]);

    async function getNewPosts(lastDateFetch) {
        const URL_ADD = "/api/v1/post/new/recommended?lastFetchDateTime=" + lastDateFetch;
        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            setLastNewPostFetch(data.body.serverDateTime);
            setPosts(prevPosts => [...data.body.posts, ...prevPosts]);
            setNewPostsCount(0);
        }
    }

    async function getPosts(pageNumber, date) {
        
        if (posts.length === 0) {
            setPageFetch(0);
        }

        const URL_ADD = "/api/v1/post/recommended?pageNumber=" + pageNumber + "&datetime=" + date + "&pageSize=10";
        let data = await getApiCall(token, URL_ADD, navigate);

        if (data === undefined) {

        } else if (data.body.pageResult.content.length > 0) {
            setPosts(prevPosts => [...prevPosts, ...data.body.pageResult.content]);
            setPageFetch(prevPageFetch => prevPageFetch + 1);
            setFirstFetchDataTime(data.body.dateTimeFetch);
        } else {
            setMorePosts(false);
        }
    }

    const getFirstPosts = useCallback(async (tokenInput) => {
        const URL_ADD = "/api/v1/post/recommended?pageNumber=0&pageSize=10";
        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        if (data !== undefined) {
            setPosts(data.body.pageResult.content);
            setFirstFetchDataTime(data.body.dateTimeFetch);
            setLastNewPostFetch(data.body.dateTimeFetch);
        }
    }, [navigate]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        if (!tokenFromStorage) {
            navigate('/');
        }

        async function apiRequests(tokenFromStorage) {
            if (posts.length === 0) {
                await getFirstPosts(tokenFromStorage);
            }
        }

        apiRequests(tokenFromStorage);

        const interval = setInterval(() => {
            getNewPostsCounts(lastNewPostFetch);
        }, 15000);

        setToken(tokenFromStorage);

        return () => clearInterval(interval);

    }, [getFirstPosts, getNewPostsCounts, lastNewPostFetch, navigate, posts.length, profilePicture]);

    async function createPost() {
        const URL_ADD = "/api/v1/post/create";

        let post = {
            content: createPostContent
        }

        let data = await postApiCall(token, URL_ADD, navigate, post)

        if (data !== undefined) {
            setCreatePostContent('');
            getNewPosts(lastNewPostFetch);
        }
    }

    return(
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
                        <img className={styles.newPostImage} src={"data:image/jpeg;base64," + ((profilePicture) ? profilePicture : DEFAULT_URL_LOGO)} alt="Profile"></img>
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
                            userId={post.postUserInfo.id}
                            postId={post.id}
                            name={post.postUserInfo.firstName + " " + post.postUserInfo.lastName}
                            title={post.title}
                            content={post.content}
                            likes={post.likeCount}
                            comments={post.comments || []}
                            isLiked={post.liked}
                            imageData={post.postUserInfo.base64Image}
                            userProfilePic={profilePicture}
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
                    <div className={styles.spacerPost}></div>
                </div>
            </div>
        </div>
    )
}

export default Main
