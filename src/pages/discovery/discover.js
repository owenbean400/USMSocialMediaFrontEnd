import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConnectConfig from '../../config/connections.json';
import TextField from '../../components/inputs/usm-text-field';
import UserCard from "../../components/search/userCard";
import styles from "./discover.module.css";
import { getApiCall } from "../../helper/global";

function Discover() {
    const [userSearchQuery, setUserSearchQuery] = useState("")
    const [users, setUsers] = useState([]);
    const [pageFetch, setPageFetch] = useState(0);
    const [token, setToken] = useState('');
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    async function searchUsers(query, pageNumber) {
        const URL_ADD = "/api/v1/user/search?pageNumber=" + pageNumber + "&pageSize=5&query=" + query;

        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            if (pageNumber > 0) {
                setUsers(prevUsers => [...prevUsers, ...data.users.content]);
            } else {
                setUsers([...data.users.content]);
            }
            if (data.users.content.length === 0) {
                setShowMore(false);
            } else {
                setShowMore(true);
            }
            setPageFetch(prevPageFetch => prevPageFetch + 1);
        }
    }

    async function updateSearch(userQuery) {
        setPageFetch(0);
        setUserSearchQuery(userQuery);
        if (userQuery !== "") {
            await searchUsers(userQuery, 0);
        } else {
            setUsers([]);
        }
    }

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            if (token !== tokenFromStorage) {
                setToken(tokenFromStorage);
            }
        } else {
            navigate('/');
        }

    }, [navigate, token]);

    return (
        <div className={styles.discoverContainer}>
            <div className={styles.discoverContainerInside}>
                <div className={styles.userSearchBarContainer}>
                    <TextField 
                        labelText="Search User"
                        value={userSearchQuery}
                        onChange={updateSearch}
                    />
                </div>
                <div className={styles.userSearchResultContainer}>
                    {
                        (users.length === 0) ?
                        <div className={styles.noResultBar}>No Results</div>
                        : <div></div>
                    }
                    {users.map((user) => {
                        return <UserCard
                            id={user.id}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            imageData={user.base64Image}
                            />
                    })}
                    {
                        (users.length > 0 && showMore) ?
                            <div className={styles.userMoreBar} onClick={() => searchUsers(userSearchQuery, pageFetch)}>More</div>
                        : <div></div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Discover