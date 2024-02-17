import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConnectConfig from '../../config/connections.json';
import { addPost } from '../../redux/actions';
import { useDispatch } from 'react-redux';


function VerifyAwaiting() {
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        } else {
            navigate('/');
        }

        async function getPostsAsVerified() {
            const URL = ConnectConfig.api_server.url + "/api/v1/post/recommended";

            try {
                const response = await fetch(URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenFromStorage}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    let data = await response.json();
                    console.log(data);

                    dispatch(addPost(data.content));

                    navigate('/main');
                } else {
                }
            } catch (error) {
            }
        }

        getPostsAsVerified();

        const intervalId = setInterval(getPostsAsVerified, 30000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="login-page">
            <div className="login-container">
                <p className="login-display-text">Awaiting Verification</p>
                <p className="login-display-text">Please check your email</p>
                <Link className="login-links" to={'/'}>Back to login</Link>
            </div>
        </div>
    )
}

export default VerifyAwaiting;