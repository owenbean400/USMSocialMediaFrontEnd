import { useEffect, useState, useCallback } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate, useParams, Outlet } from "react-router-dom";
import NavBar from "../../components/nav/navbar";
import styles from "./userpage.module.css";
import SideSectionProfile from "../../components/sideMenu/sideSectionProfile";
import { getBase64Image } from "../../helper/global";

function UserPage() {
    const [profilePicture, setProfilePicture] = useState('');
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

        const URL = ConnectConfig.api_server.url + "/api/v1/post/count/user/" + userId;

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
                setPostCount(data?.body?.count);
            }
        } catch (error) {

        }
    }, []);

    const getUserFollowingsCountCallback = useCallback(async (tokenInput, userId) => {
        if (!userId) return;

        const URL = ConnectConfig.api_server.url + "/api/v1/user/count/followings/" + userId;

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
                setFollowingsCount(data?.followingCount);
            }
        } catch (error) {

        }
    }, []);

    const getUserFollowersCountCallback = useCallback(async (tokenInput, userId) => {
        if (!userId) return;

        const URL = ConnectConfig.api_server.url + "/api/v1/user/count/followers/" + userId;

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
                setFollowersCount(data?.followerCount);
            }
        } catch (error) {

        }
    }, []);

    const getUserProfile = useCallback(async (token_input, userId) => {
        const URL = ConnectConfig.api_server.url + "/api/v1/user/info/" + userId;

        try {
            const response = await fetch(URL, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token_input}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                let data = await response.json();
                setUserProfile(data);
            } else if (response.status === 401) {
                navigate('/');
            }
        } catch (error) {
            // Handle network error
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

        if (profilePicture === "") {
            getBase64Image(tokenFromStorage).then((value) => {
                setProfilePicture(value);
            });
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

    }, [token, userId, getUserFollowersCountCallback, getUserFollowingsCountCallback, getUserPostCountCallback, getUserProfile, navigate, profilePicture, userIdPrev, userProfile]);

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
                        user: userProfile.user
                    });
                } else {

                }
    
            } catch(error) {
    
            }
        }
    }

    function sideBarNavigation(navigation) {
        switch (navigation) {
            case "posts":
                navigate("/user/" + userId + "/posts");
                break;
            case "followers":
                navigate("/user/" + userId + "/followers");
                break;
            case "followings":
                navigate("/user/" + userId + "/followings");
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <NavBar
                imageData={profilePicture}/>
            <div className={styles.userpageContainer}>
                <div className={styles.userpageContainerInside}>
                    <div className={styles.sidemenu}>
                        <div className={styles.sidemenuInside}>
                            <SideSectionProfile
                                name={((userProfile["user"]?.firstName) ? userProfile["user"]["firstName"] : "") + " " + ((userProfile["user"]?.lastName) ? userProfile["user"]["lastName"] : "")}
                                tagLine={userProfile["user"]?.tagLine || ""}
                                bio={userProfile["user"]?.bio || ""}
                                isFollowing={userProfile?.following || false}
                                isOwnProfile={userProfile?.ownProfile || true}
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
        </div>
    );
}

export default UserPage;