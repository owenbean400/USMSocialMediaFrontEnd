import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../userpage.module.css";
import ConnectConfig from '../../../config/connections.json';
import UserCard from '../../../components/search/userCard';

function UserFollowingsPageSection() {
    const [userId, token] = useOutletContext();

    const [userFollowings, setUserFollowings] = useState(undefined);
    const [pageFollowingsFetch, setPageFollowingsFetch] = useState(1);
    const [moreFollowings, setMoreFollowings] = useState(true);

    const navigate = useNavigate();

    async function getUserFollowings() {
        if (!userId) return;

        if (userFollowings.length === 0) {
            setPageFollowingsFetch(0);
        }

        const URL = ConnectConfig.api_server.url + "/api/v1/user/followings/" + userId + "?pageNumber=" + pageFollowingsFetch + "&pageSize=10";

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
                if (data?.body?.userFollowList?.content) {
                    if (data.body.userFollowList.content.length > 0) {
                        setUserFollowings(prevUsers => [...prevUsers, ...data.userFollowList.content]);
                        setPageFollowingsFetch(prevPage => prevPage + 1);
                    } else {
                        setMoreFollowings(false);
                    }
                }
            } else if (response.status === 401) {
                navigate("/");
            }
        } catch (error) {

        }
    }

    const getUserFollowingsCallback = useCallback(async () => {
        if (!userId) return;

        const URL = ConnectConfig.api_server.url + "/api/v1/user/followings/" + userId + "?pageNumber=0&pageSize=10";

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
                setUserFollowings(data.userFollowList.content);
            } else if (response.status === 401) {
                navigate("/");
            }
        } catch (error) {
            // Handle error network
        }
    }, [navigate, token, userId]);

    useEffect(() => {
        if (userFollowings === undefined) {
            getUserFollowingsCallback();
        }
    })

    return (
        <div className={styles.followContainer}>
            {(userFollowings !== undefined) ? userFollowings.map((user, index) => {
                return <UserCard
                    key={user.id}
                    id={user.id}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    imageData={user.base64Image}
                    />
            }) : <div></div>
            }
            {
                (moreFollowings) ?
                <div className={styles.moreFollowContainer} onClick={() => getUserFollowings()}>
                    <p>More Followings</p>
                </div>
                : 
                <div className={styles.noMoreFollowContainer}>
                    <p>No More Followings</p>
                </div>
            }
        </div>
    )
}

export default UserFollowingsPageSection;