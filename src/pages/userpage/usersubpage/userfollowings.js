import { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../userpage.module.css";
import UserCard from '../../../components/search/userCard';
import { getApiCall } from "../../../helper/global";

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

        const URL_ADD = "/api/v1/user/followings/" + userId + "?pageNumber=" + pageFollowingsFetch + "&pageSize=10";
        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            if (data?.body?.userFollowList?.content) {
                if (data.body.userFollowList.content.length > 0) {
                    setUserFollowings(prevUsers => [...prevUsers, ...data.userFollowList.content]);
                    setPageFollowingsFetch(prevPage => prevPage + 1);
                } else {
                    setMoreFollowings(false);
                }
            }
        }
    }

    const getUserFollowingsCallback = useCallback(async () => {
        if (!userId) return;

        const URL_ADD = "/api/v1/user/followings/" + userId + "?pageNumber=0&pageSize=10";
        let data = await getApiCall(token, URL_ADD, navigate);

        if (data !== undefined) {
            console.log(data);
            setUserFollowings(data.userFollowList.content);
            console.log("AFTER");
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