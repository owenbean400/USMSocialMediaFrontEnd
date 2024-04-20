import { useEffect, useState, useCallback } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate, useParams, Outlet } from "react-router-dom";
import styles from "./userpage.module.css";
import SideSectionProfile from "../../components/sideMenu/sideSectionProfile";
import { getApiCall } from "../../helper/global";

function UserPage() {
    const { userId } = useParams();
    const [userIdState, setUserIdState] = useState(userId);
    const [userIdPrev, setUserIdPrev] = useState(undefined);
    const [userProfile, setUserProfile] = useState({});
    const [token, setToken] = useState('');
    const [followersCount, setFollowersCount] = useState(undefined);
    const [followingsCount, setFollowingsCount] = useState(undefined);
    const [postCount, setPostCount] = useState(undefined);
    const navigate = useNavigate();

    const getUserPostCountCallback = useCallback(async (tokenInput, userId) => {
        if (!userId) return;

        const URL_ADD = "/api/v1/post/count/user/" + userId;

        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        if (data !== undefined) {
            setPostCount(data?.body?.count);
        }
    }, [navigate]);

    const getUserFollowingsCountCallback = useCallback(async (tokenInput, userId) => {
        if (!userId) return;

        const URL_ADD = "/api/v1/user/count/followings/" + userId;

        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        if (data !== undefined) {
            setFollowingsCount(data?.followingCount);
        }
    }, [navigate]);

    const getUserFollowersCountCallback = useCallback(async (tokenInput, userId) => {
        if (!userId) return;

        const URL_ADD = "/api/v1/user/count/followers/" + userId;

        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        if (data !== undefined) {
            setFollowersCount(data?.followerCount);
        }
    }, [navigate]);

    const getUserProfile = useCallback(async (tokenInput, userId) => {
        const URL_ADD = "/api/v1/user/info/" + userId;

        let data = await getApiCall(tokenInput, URL_ADD, navigate);

        if (data !== undefined) {
            setUserProfile(data);
        }
    }, [navigate]);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        if (tokenFromStorage) {
            if (token !== tokenFromStorage) {
                setToken(tokenFromStorage);
            }
        } else {
            navigate('/');
        }

        async function fetchUserInformation() {
            getUserProfile(tokenFromStorage, userId);
            getUserFollowersCountCallback(tokenFromStorage, userId);
            getUserFollowingsCountCallback(tokenFromStorage, userId);
            getUserPostCountCallback(tokenFromStorage, userId);
        }

        if ((userIdPrev === undefined || userIdPrev !== userId) && userId !== undefined) {
            setUserIdPrev(userId);
            setUserIdState(userId);
            fetchUserInformation();
        }

        if (userIdPrev === undefined && Object.entries(userProfile).length === 0) {
            setUserIdPrev(userId);
            fetchUserInformation();
        }

    }, [token, userId, getUserFollowersCountCallback, getUserFollowingsCountCallback, getUserPostCountCallback, getUserProfile, navigate, userIdPrev, userProfile]);

    async function followPerson() {
        const URL = ConnectConfig.api_server.url + "/api/v1/user/" + ((userProfile?.following || false) ? "unfollow" : "follow") + "/" + userId;

        if (userProfile["user"]?.id) {
            try {
                const response = await fetch(URL, {
                    method: ((userProfile?.following || false) ? "DELETE" : "POST"),
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: userProfile["user"]["id"]
                });

                if (response.ok) {
                    setUserProfile({
                        following: !userProfile.following,
                        ownProfile: userProfile.ownProfile,
                        user: userProfile.user
                    });
                    getUserFollowersCountCallback(token, userId);
                } else {

                }
    
            } catch(error) {
    
            }
        }
    }

    function sideBarNavigation(navigation) {
        switch (navigation) {
            case "posts":
                navigate("/main/user/" + userId + "/posts");
                break;
            case "followers":
                navigate("/main/user/" + userId + "/followers");
                break;
            case "followings":
                navigate("/main/user/" + userId + "/followings");
                break;
            default:
                break;
        }
    }

    return (
        <div className={styles.userpageContainer}>
            <div className={styles.userpageContainerInside}>
                <div className={styles.sidemenu}>
                    <div className={styles.sidemenuInside}>
                        <SideSectionProfile
                            userId={userId}
                            name={((userProfile["user"]?.firstName) ? userProfile["user"]["firstName"] : "") + " " + ((userProfile["user"]?.lastName) ? userProfile["user"]["lastName"] : "")}
                            tagLine={userProfile["user"]?.tagLine || ""}
                            bio={userProfile["user"]?.bio || ""}
                            isFollowing={userProfile?.following || false}
                            isOwnProfile={userProfile?.ownProfile}
                            header="Profile"
                            followPerson={() => followPerson()}
                            imageData={userProfile?.user?.base64Image}
                            items={[]}
                            changePage={(navigation) => sideBarNavigation(navigation)}
                            followersCount={followersCount}
                            followingsCount={followingsCount}
                            postsCount={postCount}
                        />
                    </div>
                </div>
                <Outlet context={[userIdState, token]} />
            </div>
        </div>
    );
}

export default UserPage;