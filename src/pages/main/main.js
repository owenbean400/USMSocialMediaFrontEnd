import React, { useEffect, useState } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../../redux/actions';
import Post from "../../components/posts/post";
import PostTests from '../../components/posts/posts_test.json';

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
            <h1>Token</h1>
            <p>{token}</p>
            <h2>Posts</h2>
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
        </div>
    )
}

export default Main
