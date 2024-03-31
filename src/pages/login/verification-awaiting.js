import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConnectConfig from '../../config/connections.json';
import { addPost } from '../../redux/actions';
import { useDispatch } from 'react-redux';


function VerifyAwaiting() {
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getPostsAsVerified = useCallback(async (token_id) => {
        const URL = ConnectConfig.api_server.url + "/api/v1/post/recommended";
    
        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token_id}`,
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
    }, [dispatch, navigate]); 

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        } else {
            //navigate('/');
        }

        getPostsAsVerified(tokenFromStorage);

        const intervalId = setInterval(() => getPostsAsVerified(tokenFromStorage), 30000);

        return () => clearInterval(intervalId);
    }, [getPostsAsVerified]);

    return (
        <div className="login-page">
            <div className="login-container">
                    <div className="bounce-container">
                        <div className="bounce-1">A</div>
                        <div className="bounce-2">W</div>
                        <div className="bounce-3">A</div>
                        <div className="bounce-4">I</div>
                        <div className="bounce-5">T</div>
                        <div className="bounce-6">I</div>
                        <div className="bounce-7">N</div>
                        <div className="bounce-8">G</div>
                        <div className="bounchSpace"></div>
                        <div className="bounce-9">V</div>
                        <div className="bounce-10">E</div>
                        <div className="bounce-11">R</div>
                        <div className="bounce-12">I</div>
                        <div className="bounce-13">F</div>
                        <div className="bounce-14">I</div>
                        <div className="bounce-15">C</div>
                        <div className="bounce-16">A</div>
                        <div className="bounce-17">T</div>
                        <div className="bounce-18">I</div>
                        <div className="bounce-19">O</div>
                        <div className="bounce-20">N</div>
                    </div>
                <p className="login-header-text">Please check your email</p>
                <p className="click-link-button" onClick={() => getPostsAsVerified(token)}>Force Refresh</p>
                <Link className="login-links" to={'/'}>Back to login</Link>
            </div>
        </div>
    )
}

export default VerifyAwaiting;