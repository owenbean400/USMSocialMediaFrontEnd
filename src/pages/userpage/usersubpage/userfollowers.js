import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../userpage.module.css";
import ConnectConfig from '../../../config/connections.json';
import UserCard from '../../../components/search/userCard';

function UserFollowersPageSection(props) {
    const [userId, token] = useOutletContext();

    const [userFollowers, setUserFollowers] = useState(undefined);
    const [pageFollowersFetch, setPageFollowersFetch] = useState(1);
    const [moreFollowers, setMoreFollowers] = useState(true);

    const navigate = useNavigate();

    async function getUserFollowers() {
        if (!userId) return;

        if (userFollowers.length === 0) {
            setPageFollowersFetch(0);
        }

        const URL = ConnectConfig.api_server.url + "/api/v1/user/followers/" + userId + "?pageNumber=" + pageFollowersFetch + "&pageSize=10";

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
                console.log("CONTENT");
                console.log(data);
                if (data?.userFollowList?.content) {
                    if (data.userFollowList.content.length > 0) {
                        setUserFollowers(prevUsers => [...prevUsers, ...data.userFollowList.content]);
                        setPageFollowersFetch(prevPage => prevPage + 1);
                    } else {
                        setMoreFollowers(false);
                    }
                }
            } else if (response.status === 401) {
                navigate("/");
            }
        } catch (error) {

        }
    }

    const getUserFollowersCallback = useCallback(async (tokenInput) => {
        if (!userId) return;

        const URL = ConnectConfig.api_server.url + "/api/v1/user/followers/" + userId + "?pageNumber=0&pageSize=10";

        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${tokenInput}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                let data = await response.json();
                setUserFollowers(data.userFollowList.content);
            } else if (response.status === 401) {
                navigate("/");
            }
        } catch (error) {
            // Handle error network
        }
    }, [navigate, userId]);

    useEffect(() => {
        if (userFollowers === undefined) {
            getUserFollowersCallback(token);
        }
    })

    return (
        <div className={styles.followContainer}>
            {(userFollowers !== undefined) ? userFollowers.map((user, index) => {
                return <UserCard
                    key={user.id}
                    id={user.id}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    imageData={user.base64Image}
                    />
            }) : <div></div>}
            {
                (moreFollowers) ?
                <div className={styles.moreFollowContainer} onClick={() => getUserFollowers()}>
                    <p>More Followers</p>
                </div>
                : 
                <div className={styles.noMoreFollowContainer}>
                    <p>No More Followers</p>
                </div>
            }
        </div>
    )
}

export default UserFollowersPageSection;