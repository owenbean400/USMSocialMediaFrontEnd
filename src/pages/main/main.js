import React, { useEffect, useState } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../../redux/actions';

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


        if (posts.length == 0) {
            getPosts(tokenFromStorage);
        }

    }, []);

    return(
        <div>
            <h1>Token</h1>
            <p>{token}</p>
            <h2>Posts</h2>
            {posts.map((post, index) => (
                <p key={index}>{post}</p>
            ))}
        </div>
    )
}

export default Main
