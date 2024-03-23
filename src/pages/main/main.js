import React, { useEffect, useState } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../../redux/actions';
import Post from "../../components/posts/post";
import SideSection from "../../components/sideMenu/sideSection";
import styles from "./main.module.css";
import NavBar from "../../components/nav/navbar";

function Main() {
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const posts = useSelector(state => state.posts);
    const [content, setContent] = useState('');
    const dispatch = useDispatch();

    console.log(posts);

    useEffect(() => {
        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        } else {
            navigate('/');
        }

        async function getPosts(token_input) {
            const URL = ConnectConfig.api_server.url + "/api/v1/post/recommended";

            try {
                const response = await fetch(URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token_input}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    let data = await response.json();

                    dispatch(addPost(data.body));

                    navigate('/main');
                } else {
                }
            } catch (error) {
            }
        }


        if (posts.length === 0) {
            getPosts(tokenFromStorage);
        }

    }, [dispatch, navigate, posts.length]);

    async function createPost() {
        const URL = ConnectConfig.api_server.url + "/api/v1/post/create";

        try {
            let post = {
                content: content
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
                let data = await response.json();

                console.log(data);

                setContent('');
            } else {
                console.log("Status not ok");

                let data = await response.json();

                console.log(data);
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
                            <input className={styles.newPostTextFieldInput} type="text" onChange={(e) => setContent(e.target.value)} value={content}/>
                            <p onClick={() => createPost()}>Post</p>
                        </div>
                        {posts[0] && posts[0].content.map((post, index) => (
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
                        <div className={styles.morePostContainer}>
                            <p>More Posts</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
