import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom";
import ConnectConfig from '../../config/connections.json';
import styles from "./messages.module.css";
import { DEFAULT_URL_LOGO, getApiCall, postApiCall } from "../../helper/global";


function MessageUserPage() {

    const { userId } = useParams();
    const [ownUserId, setOwnUserId] = useState(undefined);
    const [userProfile, setUserProfile] = useState(undefined);
    const [createMessageContent, setCreateMessageContent] = useState("");
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [messages, setMessages] = useState(undefined);

    const getMessages = useCallback(async (token_input) => {
        if (!userId) return;

        const URL_ADD = "/api/v1/message/fetch/user/" + userId;

        let data = await getApiCall(token_input, URL_ADD, navigate);

        if (data !== undefined) {
            setMessages(data);
        }

    }, [navigate, userId]);

    async function postMessage() {
        const URL_ADD = "/api/v1/message/user/" + userId;

        let post = {
            content: createMessageContent
        }

        let data = await postApiCall(token, URL_ADD, navigate, post);

        if (data !== undefined) {
            setCreateMessageContent("");
            getMessages(token);
        }
    }

    const getOwnUserProfile = useCallback(async (token_input) => {
        const URL_ADD = "/api/v1/user/profile";

        let data = await getApiCall(token_input, URL_ADD, navigate);

        if (data !== undefined) {
            setOwnUserId(data?.user?.id);
        }
    }, [navigate]);

    const getUserProfile = useCallback(async (tokenInput) => {
        const URL_ADD = "/api/v1/user/info/" + userId;

        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        if (data !== undefined) {
            setUserProfile(data);
        }
    }, [navigate, userId]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        if (!tokenFromStorage) {
            navigate('/');
        }

        if (ownUserId === undefined) {
            getOwnUserProfile(tokenFromStorage);
        }

        if (messages === undefined) {
            getMessages(tokenFromStorage);
        }

        if (userProfile === undefined) {
            getUserProfile(tokenFromStorage);
        }

        setToken(tokenFromStorage);
    }, [getMessages, getOwnUserProfile, getUserProfile, messages, navigate, ownUserId, userProfile]);

    return (
        <div className={styles.messagesUserPageContainer}>
            <UserMessageInfo
                firstName={(userProfile?.user?.firstName) ? userProfile["user"]["firstName"] : ""}
                lastName={(userProfile?.user?.lastName) ? userProfile["user"]["lastName"] : ""}
                profilePicture={userProfile?.user?.base64Image}
            />
            <div className={styles.messageUserPageDisplayContainer}>
                {(messages && messages.length > 0) ? messages.map((info) => {
                    return (<Message 
                        content={info.content}
                        sentMessage={info.userId === ownUserId}
                    />)
                }) : <div></div>}
            </div>
            <div className={styles.newMessageContainer}>
                <input className={styles.newMessageTextFieldInput} onChange={(e) => setCreateMessageContent(e.target.value)} value={createMessageContent} type="text"/>
                <p className={styles.sendClick} onClick={() => postMessage()}>Send</p>
            </div>
        </div>
    )
}

function Message(props) {
    return (<div className={(props.sentMessage ? styles.messageRight : styles.messageLeft)}>
        <p>{props.content}</p>
    </div>)
}

function UserMessageInfo(props) {
    return (
    <div className={styles.messageUserProfile}>
        <img className={styles.messageSelectImage} src={"data:image/jpeg;base64," + ((props.profilePicture) ? props.profilePicture : DEFAULT_URL_LOGO)} alt="message-profile"></img>
        <p className={styles.messageUserProfileName}>{props.firstName} {props.lastName}</p>
    </div>)
}

export default MessageUserPage;