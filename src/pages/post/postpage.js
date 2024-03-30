import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConnectConfig from '../../config/connections.json';
import NavBar from "../../components/nav/navbar";
import Post from "../../components/posts/post";
import styles from "./postpage.module.css";
import XIcon from "../../images/x.png"
import FacebookIcon from "../../images/facebook.png"
import LinkedInIcon from "../../images/linkedin.png"
import MailIcon from "../../images/mail.png"

function PostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({});

    const getPost = useCallback(async (token_input) => {
        if (!postId) return;

        const URL = ConnectConfig.api_server.url + "/api/v1/post/session/" + postId;

        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token_input}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                let data = await response.json();
                console.log("Body:")
                console.log(data.body);
                setPost(data.body);
            } else if (response.status === 401) {
                navigate('/');
            }
        } catch (error) {
            console.log("ERROR!");
        }
    }, [navigate, postId]);

    useEffect(() => {

        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (!tokenFromStorage) {
            navigate('/');
        }

        if (!post.hasOwnProperty("id")) {
            getPost(tokenFromStorage);
        }

    }, [getPost, navigate, post]);


    return(
        <div>
            <NavBar />
            <div className={styles.postPageContainer}>
                <div className={styles.postPageContainerInside}>
                    <div className={styles.postContainerOutside}>
                        <div className={styles.shareIconContainer}>
                            <div>
                            <a class="twitter-share-button"
                                href={("https://twitter.com/intent/tweet?url=" + window.location.href).replace("#", "%23")}
                                target="_blank"
                                rel="canonical noreferrer">
                                    <img
                                        className={styles.shareIcon}
                                        src={XIcon}
                                        alt="X Icon"></img></a>
                            </div>
                            <div
                                data-href={window.location.href}
                                data-layout=""
                                data-size="">
                                <a 
                                    target="_blank"
                                    href={"https://www.facebook.com/sharer/sharer.php?u=" + (window.location.href).replaceAll("#", "%23").replaceAll(":", "%3A").replaceAll("/", "%2F") + "&amp;src=sdkpreparse"}
                                    class="fb-xfbml-parse-ignore"
                                    rel="noreferrer"><img 
                                        className={styles.shareIcon}
                                        src={FacebookIcon}
                                        alt="Facebook Icon"></img></a>
                            </div>
                            <a
                                href={"http://www.linkedin.com/shareArticle?mini=true&url=" + (window.location.href).replaceAll("#", "%23").replaceAll(":", "%3A").replaceAll("/", "%2F")}
                                target="_blank"
                                rel="noreferrer"
                            ><img 
                                className={styles.shareIcon}
                                src={LinkedInIcon}
                                alt="LinkedIn Icon"></img></a>
                            <a
                                href={"mailto:?&body=" + window.location.href}>
                                <img 
                                    className={styles.shareIcon}
                                    src={MailIcon}
                                    alt="Mail Icon"></img>
                            </a>
                        </div>
                    {
                        (post.hasOwnProperty("id")) ?
                        <Post
                            userId={post.postUserInfo.id}
                            postId={post.id}
                            name={post.postUserInfo.firstName + " " + post.postUserInfo.lastName}
                            title={post.title}
                            content={post.content}
                            likes={post.likeCount}
                            comments={post.comments}
                            isLiked={post.isLiked}
                            ></Post> :
                        <div></div>
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostPage;