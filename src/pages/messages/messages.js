
// Recent List before message
// /api/v1/message/recent/

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiCall } from "../../helper/global";
import ConnectConfig from '../../config/connections.json';
import styles from "./messages.module.css";
import { DEFAULT_URL_LOGO, formatDate } from "../../helper/global";

// Send a message
// /api/v1/message/user/{id}

function MessagePage() {
    const [messages, setMessages] = useState(undefined);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    function goToMessage(userId) {
        navigate("/main/message/" + userId);
    }

    const getRecentMessagesCallback = useCallback(async (tokenInput) => {

        const URL_ADD = "/api/v1/message/recent/";
        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        setMessages(data.reverse());

    }, [navigate]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        if (!tokenFromStorage) {
            navigate('/');
        }

        if (messages === undefined) {
            getRecentMessagesCallback(tokenFromStorage);
        }

        if (token !== tokenFromStorage) {
            setToken(tokenFromStorage);
        }

    }, [getRecentMessagesCallback, messages, navigate, token]);

    return (
    <div className={styles.messagesPageContainer}>
        {(messages !== undefined) ? 
        messages.map((message) => {
            return (
                <div className={styles.messageSelectContainer} onClick={() => goToMessage(message.userId)}>
                    <div className={styles.messageSelectLeftContainer}>
                        <img className={styles.messageSelectImage} src={"data:image/jpeg;base64," + ((message.base64Image) ? message.base64Image : DEFAULT_URL_LOGO)} alt="message-profile"></img>
                        <div className={styles.messageSelectInfoContainer}>
                            <p className={styles.messageSelectName}>{message.firstName} {message.lastName}</p>
                            <p className={styles.messageSelectDate}>{formatDate(message.timestamp)}</p>
                        </div>
                    </div>
                    <p className={styles.messageSelectContent}>{message.lastMessage}</p>
                </div>);
        }) : <div></div>
        }
    </div>);
}

export default MessagePage;