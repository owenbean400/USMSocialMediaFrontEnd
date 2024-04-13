import { useEffect, useState, useCallback } from "react";
import styles from "../userpage.module.css";
import ConnectConfig from '../../../config/connections.json';
import { useNavigate, useOutletContext } from "react-router-dom";
import Post from "../../../components/posts/post";
import { getApiCall } from "../../../helper/global";

function UserPost() {
    const [userId] = useOutletContext();

    const [token, setToken] = useState('');
    const [userPost, setUserPost] = useState(undefined);
    const [lastNewPostFetch, setLastNewPostFetch] = useState("");
    const [newPostsCount, setNewPostsCount] = useState(0);
    const [dateTime, setDateTime] = useState("");
    const [pageUserFetch, setPageUserFetch] = useState(1);
    const [morePosts, setMorePosts] = useState(true);
    const navigate = useNavigate();

    async function getNewPosts(lastDateFetch) {
        const URL_ADD = "/api/v1/post/new/user/" + userId + "?lastFetchDateTime=" + lastDateFetch;

        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            setLastNewPostFetch(data.body.serverDateTime);
            setUserPost(prevUserPosts => [...data.body.posts, ...prevUserPosts]);
            setNewPostsCount(0);
        }
    }

    const getNewPostsCount = useCallback(async (lastDateFetch) => {
        const URL_ADD = "/api/v1/post/new/fetch/user/" + userId + "?lastFetchDateTime=" + lastDateFetch;

        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            setNewPostsCount(data.body.amountOfNewPost);
        }
    }, [token, userId, navigate]);

    async function getUserPosts(pageNumber, date) {
        if (!userId) return; 

        if (userPost.length === 0 || userPost === undefined) {
            setPageUserFetch(0);
        }

        const URL_ADD = "/api/v1/post/user/" + userId + "?pageNumber=" + pageNumber + "&datetime=" + date + "&pageSize=10";

        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            if (data.body.pageResult.content.length > 0) {
                if (userPost === undefined) {
                    setUserPost([...data.body.pageResult.content]);
                } else {
                    setUserPost(prevUserPosts => [...prevUserPosts, ...data.body.pageResult.content]);
                }
                setPageUserFetch(prevpageUserFetch => prevpageUserFetch + 1);
                setDateTime(data.body.dateTimeFetch);
            } else {
                setMorePosts(false);
            }
        }
    }

    const getUserPostsCallback = useCallback(async (tokenInput) => {
        const URL_ADD = "/api/v1/post/user/" + userId + "?pageNumber=0&pageSize=10";
        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        if (data !== undefined) {
            setUserPost(data.body.pageResult.content);
            setDateTime(data.body.dateTimeFetch);
            setLastNewPostFetch(data.body.dateTimeFetch);
        }
    }, [navigate, userId]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        if (tokenFromStorage) {
            if (token !== tokenFromStorage) {
                setToken(tokenFromStorage);
            }
        } else {
            navigate('/');
        }

        if (userPost === undefined && token !== '') {
            getUserPostsCallback(tokenFromStorage);
        }

        const interval = setInterval(() => {
            getNewPostsCount(lastNewPostFetch);
        }, 15000);

        return () => clearInterval(interval);
    }, [token, getNewPostsCount, getUserPostsCallback, lastNewPostFetch, navigate, userPost]);

    return (
        <div className={styles.postsContainer}>
            {
                (newPostsCount > 0) ?
                <div className={styles.morePostContainer} onClick={() => getNewPosts(lastNewPostFetch)}>
                    <p>{newPostsCount} New Posts Awaiting</p>
                </div> : <div></div>
            }
            {(userPost !== undefined) ? userPost.map((post, index) => (
                <Post
                    key={index}
                    userId={post.postUserInfo.id}
                    postId={post.id}
                    name={post.postUserInfo.firstName + " " + post.postUserInfo.lastName}
                    title={post.title}
                    content={post.content}
                    likes={post.likeCount}
                    comments={post.comments || []}
                    isLiked={post.isLiked}
                    imageData={post.postUserInfo.base64Image}
                ></Post>
            )) : <div></div>}
            {
                (morePosts) ?
                <div className={styles.morePostContainer} onClick={() => getUserPosts(pageUserFetch, dateTime)}>
                    <p>More Posts</p>
                </div>
                : 
                <div className={styles.noMorePostContainer}>
                    <p>No More Posts</p>
                </div>
            }
        </div>
    )
}

export default UserPost;