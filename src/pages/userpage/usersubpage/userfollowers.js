import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../userpage.module.css";
import UserCard from '../../../components/search/userCard';
import { getApiCall } from "../../../helper/global";

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

        const URL_ADD = "/api/v1/user/followers/" + userId + "?pageNumber=" + pageFollowersFetch + "&pageSize=10";
        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            if (data?.userFollowList?.content) {
                if (data.userFollowList.content.length > 0) {
                    setUserFollowers(prevUsers => [...prevUsers, ...data.userFollowList.content]);
                    setPageFollowersFetch(prevPage => prevPage + 1);
                } else {
                    setMoreFollowers(false);
                }
            }
        }
    }

    const getUserFollowersCallback = useCallback(async (tokenInput) => {
        if (!userId) return;

        const URL_ADD = "/api/v1/user/followers/" + userId + "?pageNumber=0&pageSize=10";
        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        if (data !== undefined) {
            setUserFollowers(data.userFollowList.content);
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
            <div className={styles.spacerPost}></div>
        </div>
    )
}

export default UserFollowersPageSection;