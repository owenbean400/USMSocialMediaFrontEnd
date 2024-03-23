import { useEffect, useState } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/nav/navbar";
import styles from "./userpage.module.css";
import SideSectionProfile from "../../components/sideMenu/sideSectionProfile";

function UserPage() {
    let { userId } = useParams();
    const [userProfile, setUserProfile] = useState({});
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        } else {
            navigate('/');
        }

        async function getUserProfile(token_input) {
            const URL = ConnectConfig.api_server.url + "/api/v1/user/info/" + userId;

            try {
                const response = await fetch(URL, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token_input}`,
                        'Content-Type': 'application/json'
                    }
                })

                if (response.ok) {
                    let data = await response.json();

                    console.log(data);
                    setUserProfile(data);
                } else {

                }

                if (response.status === 401) {
                    navigate('/');
                }

            } catch (error) {

            }
        }

        getUserProfile(tokenFromStorage);


    }, [navigate, userId])

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


    return (
        <div>
            <NavBar />
            <div className={styles.userpageContainer}>
                <div className={styles.userpageContainerInside}>
                    <div className={styles.sidemenu}>
                        <div className={styles.sidemenuInside}>
                            <SideSectionProfile
                                name={((userProfile["user"]?.firstName) ? userProfile["user"]["firstName"] : "") + " " + ((userProfile["user"]?.lastName) ? userProfile["user"]["lastName"] : "")}
                                tagLine={userProfile["user"]?.tagLine || ""}
                                bio={userProfile["user"]?.bio || ""}
                                isFollowing={userProfile["user"]?.following || false}
                                isOwnProfile={userProfile?.ownProfile || true}
                                header="Profile"
                                followPerson={followPerson}
                                items={[]}
                            />
                        </div>
                    </div>
                    <div className={styles.postsContainer}>
                        <div>
            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPage;