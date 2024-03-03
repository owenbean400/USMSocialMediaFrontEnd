import React, { useEffect, useState } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../../redux/actions';
import Post from "../../components/posts/post";
import PostTests from '../../components/posts/posts_test.json';
import SideSection from "../../components/sideMenu/sideSection";
import styles from "./main.module.css";
import NavBar from "../../components/nav/navbar";

function Main() {
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const posts = useSelector(state => state.posts);
    const dispatch = useDispatch();

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

                    dispatch(addPost(data.content));

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

    return(
        <div>
            <NavBar />
            <div className={styles.mainContainer}>
                <div className={styles.mainContainerInside}>
                    <div className={styles.sidemenu}>
                        <div className={styles.sidemenuInside}>
                            <SideSection 
                                header="Groups"
                                items={[
                                    {
                                        to: "/",
                                        title: "USM Esports"
                                    },
                                    {
                                        to: "/",
                                        title: "USM Track"
                                    },
                                ]}
                            />
                            <SideSection 
                                header="Classes"
                                items={[
                                    {
                                        to: "/",
                                        title: "COS 420 Spring 2024"
                                    },
                                    {
                                        to: "/",
                                        title: "ITA 120 Spring 2024"
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    <div className={styles.postsContainer}>
                        <div className={styles.newPostContainer}>
                            <div className={styles.newPostImage}></div>
                            <input className={styles.newPostTextFieldInput} type="text" />
                            <p>Post</p>
                        </div>
                        {PostTests.posts.map((post, index) => (
                            <Post
                                key={index}
                                name={post.name}
                                title={post.title}
                                content={post.content}
                                likes={post.likes}
                                comments={post.comments}
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
