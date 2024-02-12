import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConnectConfig from '../../config/connections.json';


function VerifyAwaiting() {
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        } else {
            navigate(process.env.PUBLIC_URL + '/');
        }

        async function checkVerified() {
            const URL = ConnectConfig.api_server.url + "/api/v1/verifyawait";

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

                    if (data.verified) {
                        navigate(process.env.PUBLIC_URL + '/main');
                    }
                } else {
                    navigate(process.env.PUBLIC_URL + '/');
                }
            } catch (error) {
                navigate(process.env.PUBLIC_URL + '/')
            }
        }

        checkVerified();

        const intervalId = setInterval(checkVerified, 30000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="login-page">
            <div className="login-container">
                <p className="login-display-text">Awaiting Verification</p>
                <p className="login-display-text">Please check your email</p>
                <Link className="login-links" to={process.env.PUBLIC_URL + '/'}>Back to login</Link>
            </div>
        </div>
    )
}

export default VerifyAwaiting;