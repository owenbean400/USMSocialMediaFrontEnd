import { useEffect, useState } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate } from "react-router-dom";

function Main() {
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        } else {
            navigate('/');
        }
    }, []);

    return(
        <div>
            <h1>Token</h1>
            <p>{token}</p>
        </div>
    )
}

export default Main
