import { useEffect, useState, useCallback } from "react";
import ConnectConfig from '../../config/connections.json';
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/nav/navbar";
import styles from "./userpage.module.css";
import SideSectionProfile from "../../components/sideMenu/sideSectionProfile";
import Post from "../../components/posts/post";

function UserPage() {
    const [dateTime, setDateTime] = useState("");
    const [lastNewPostFetch, setLastNewPostFetch] = useState("");
    const [newPostsCount, setNewPostsCount] = useState(0);
    const { userId } = useParams();
    const [userPost, setUserPost] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const [pageFetch, setPageFetch] = useState(1);
    const [token, setToken] = useState('');
    const [morePosts, setMorePosts] = useState(true);
    const navigate = useNavigate();

    const getNewPostsCount = useCallback(async (lastDateFetch) => {
        if (!userId) return;
    
        const URL = ConnectConfig.api_server.url + "/api/v1/post/new/fetch/user/" + userId + "?lastFetchDateTime=" + lastDateFetch;;
    
        try {
          const response = await fetch(URL, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            let data = await response.json();
            setNewPostsCount(data.body.amountOfNewPost);
          }
        } catch (error) {
        }
      }, [userId, token]);

    async function getNewPosts(lastDateFetch) {
        if (!userId) return; 

        const URL = ConnectConfig.api_server.url + "/api/v1/post/new/user/" + userId + "?lastFetchDateTime=" + lastDateFetch;

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
                setLastNewPostFetch(data.body.serverDateTime);
                setUserPost(prevUserPosts => [...data.body.posts, ...prevUserPosts]);
                setNewPostsCount(0);
            }
        } catch (error) {

        }
    }

    async function getUserPosts(pageNumber, date) {
        if (!userId) return; 

        if (userPost.length === 0) {
            setPageFetch(0);
        }
    
        const URL = ConnectConfig.api_server.url + "/api/v1/post/user/" + userId + "?pageNumber=" + pageNumber + "&datetime=" + date + "&pageSize=10";
    
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
                setUserPost(prevUserPosts => [...prevUserPosts, ...data.body.pageResult.content]);
                if (data.body.pageResult.content.length > 0) {
                    setPageFetch(prevPageFetch => prevPageFetch + 1);
                    setDateTime(data.body.dateTimeFetch);
                } else {
                    setMorePosts(false);
                }
            } else if (response.status === 401) {
                navigate('/');
            }
        } catch (error) {
            // Handle network error
        }
    }

    const getUserPostsCallback = useCallback(async (pageNumber, date) => {
        if (!userId) return; 
    
        const URL = ConnectConfig.api_server.url + "/api/v1/post/user/" + userId + "?pageNumber=0&pageSize=10";
    
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
                setUserPost(data.body.pageResult.content);
                setDateTime(data.body.dateTimeFetch);
                setLastNewPostFetch(data.body.dateTimeFetch);
            } else if (response.status === 401) {
                navigate('/');
            }
        } catch (error) {
            // Handle network error
        }
    }, [userId, token, navigate]);

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
        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            if (token !== tokenFromStorage) {
                setToken(tokenFromStorage);
            }
        } else {
            navigate('/');
        }

        async function apiRequests() {
            if (userId && Object.entries(userProfile).length === 0) {
                await getUserProfile(tokenFromStorage, userId);
    
                if (userPost.length === 0) {
                    await getUserPostsCallback(0);
                }
            }
        }

        apiRequests();
        
        const interval = setInterval(() => {
            getNewPostsCount(lastNewPostFetch);
        }, 15000); 
    
        return () => clearInterval(interval);

    }, [getNewPostsCount, getUserPostsCallback, getUserProfile, lastNewPostFetch, navigate, token, userId, userPost.length, userProfile]);

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
                        {
                            (newPostsCount > 0) ?
                            <div className={styles.morePostContainer} onClick={() => getNewPosts(lastNewPostFetch)}>
                                <p>{newPostsCount} New Posts Awaiting</p>
                            </div> : <div></div>
                        }
                        {userPost.map((post, index) => (
                            <Post
                                key={index}
                                id={post.postUserInfo.id}
                                name={post.postUserInfo.firstName + " " + post.postUserInfo.lastName}
                                title={post.title}
                                content={post.content}
                                likes={post.likeCount}
                                comments={post.comments || []}
                            ></Post>
                        ))}
                        {
                            (morePosts) ?
                            <div className={styles.morePostContainer} onClick={() => getUserPosts(pageFetch, dateTime)}>
                                <p>More Posts</p>
                            </div>
                            : 
                            <div className={styles.noMorePostContainer}>
                                <p>No More Posts</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;