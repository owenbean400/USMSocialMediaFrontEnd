import styles from "./posts.module.css";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import ConnectConfig from '../../config/connections.json';
import { Link } from 'react-router-dom';
import { DEFAULT_URL_LOGO } from "../../helper/global";


export default function Post(props) {
    const navigate = useNavigate();

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(props.comments);
    const [isLiked, setIsLiked] = useState(props.isLiked);
    const [likes, setLikes] = useState(props.likes);

    function shareLink() {
        navigate("/main/post/" + props.postId);
    }

    function displayComment() {
        if (comments.length === 0 && !showComments) {
            fetchComments();
        }

        setShowComments(!showComments);
    }

    function fetchComments() {
        // TODO: Fetch 5 comments or all if not enough
        let fetchedComments = [];

        const newComments = [...comments, ...fetchedComments];

        setComments(newComments);
    }

    async function likePostAction(post_id) {
        let currentlyLiked = isLiked;
        const URL = ConnectConfig.api_server.url + "/api/v1/post/" + ((currentlyLiked) ? "unlike" : "like");

        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        try {
            let likePost = {
                targetId: post_id,
            }

            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenFromStorage}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(likePost)
            });

            if (response.ok) {
                let data = await response.json();

                console.log(data);


                if (data.status === 1) {
                    setLikes(prevLikes => prevLikes + (currentlyLiked ? -1 : 1));
                }

                setIsLiked(!currentlyLiked);
            } else {
                console.log("Status not ok");

                let data = await response.json();

                console.log(data);
            }
        } catch (error) {
            console.log("Error")
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.contentByContainer}>
                <Link className={styles.contentByPersonContainer} to={"/main/user/" + props.userId + "/posts"}>
                    <img className={styles.imageContainer} src={"data:image/jpeg;base64," + ((props.imageData) ? props.imageData : DEFAULT_URL_LOGO)} alt="Profile"></img>
                    <div>
                        <p className={styles.contentName}>{props.name}</p>
                        <p className={styles.contentTitle}>{props.title}</p>
                    </div>
                </Link>
                <div>{props.from}</div>
            </div>
            <div className={styles.contentContainer}>{props.content}</div>
            <div className={styles.actionItemInfoContainer}>
                <p className={styles.actionItemInfo}>{likes} Like{(likes) === 1 ? "" : "s"}</p>
                <p className={styles.actionItemInfoClickable} onClick={(e) => displayComment()}>{props.comments.length} Comment{(props.comments.length) === 1 ? "" : "s"}</p>
            </div>
            <div className={styles.actionContainer}>
                <ul className={styles.actionListContainer}>
                    <li className={styles.actionList} onClick={() => likePostAction(props.postId)}>{(isLiked) ? "Liked" : "Like"}</li>
                    <div className={styles.barBlock}></div>
                    <li className={styles.actionList} onClick={(e) => displayComment()}>Comment</li>
                    <div className={styles.barBlock}></div>
                    <li className={styles.actionList} onClick={(e) => shareLink()}>Share</li>
                </ul>
            </div>
            {showComments && 
            <div className={styles.comments}>
                <CommentWrite
                    postId={props.postId}
                    imageData={props.userProfilePic}
                    showBottomBar={comments !== undefined && comments.length > 0}
                    />
                <div className={styles.commentsContainer}>
                    {comments.map((comment) => {
                        return <Comment
                            name={comment.commenterFirstName + " " + comment.commenterLastName}
                            content={comment.content}
                            imageData={comment.profilePictureBase64}
                        />
                    })}
                </div>
            </div>}
        </div>
    )
}

function Comment(props) {
    return (
        <div className={styles.commentContainer}>
            <div className={styles.contentByPersonContainer}>
                <img className={styles.imageContainerComment} src={"data:image/jpeg;base64," + ((props.imageData) ? props.imageData : DEFAULT_URL_LOGO)} alt="comment-profile"></img>
                <div>
                    <p className={styles.contentNameComment}>{props.name}</p>
                </div>
            </div>
            <div className={styles.contentCommentContainer}>{props.content}</div>
        </div>
    )
}

function CommentWrite(props) {
    const [commentContent, setCommentContent] = useState('');

    async function postComment() {
        const URL = ConnectConfig.api_server.url + "/api/v1/post/comment";

        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        try {
            let post = {
                id: props.postId,
                content: commentContent
            }

            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenFromStorage}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post)
            });

            if (response.ok) {
                let data = await response.json();

                console.log(data);

                setCommentContent('');
            } else {
                console.log("Status not ok");

                let data = await response.json();

                console.log(data);
            }
        } catch (error) {
            console.log("Error")
        }
    }

    return(
        <div className={(props.showBottomBar) ? styles.commentWriteContainerBar : styles.commentWriteContainer}>
            <img className={styles.imageContainerComment} src={"data:image/jpeg;base64," + ((props.imageData) ? props.imageData : DEFAULT_URL_LOGO)} alt="comment-post-profile"></img>
            <input className={styles.commentInput} type="text" onChange={(e) => setCommentContent(e.target.value)} value={commentContent} />
            <div className={styles.commentPost} onClick={() => postComment()}>Post</div>
        </div>
    )
}