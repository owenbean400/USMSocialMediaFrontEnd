import styles from "./posts.module.css";
import { useState } from 'react';
import ConnectConfig from '../../config/connections.json';


export default function Post(props) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(props.comments);

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

    async function likePost(post_id) {
        const URL = ConnectConfig.api_server.url + "/api/v1/post/like";

        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);

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
                <div className={styles.contentByPersonContainer}>
                    <div className={styles.imageContainer}></div>
                    <div>
                        <p className={styles.contentName}>{props.name}</p>
                        <p className={styles.contentTitle}>{props.title}</p>
                    </div>
                </div>
                <div>{props.from}</div>
            </div>
            <div className={styles.contentContainer}>{props.content}</div>
            <div className={styles.actionItemInfoContainer}>
                <p className={styles.actionItemInfo}>{props.likes} Like{(props.likes) === 1 ? "" : "s"}</p>
                <p className={styles.actionItemInfo} onClick={(e) => displayComment()}>{props.comments.length} Comment{(props.comments.length) === 1 ? "" : "s"}</p>
            </div>
            <div className={styles.actionContainer}>
                <ul className={styles.actionListContainer}>
                    <li className={styles.actionList} onClick={() => likePost(props.id)}>Like</li>
                    <div className={styles.barBlock}></div>
                    <li className={styles.actionList} onClick={(e) => displayComment()}>Comment</li>
                    <div className={styles.barBlock}></div>
                    <li className={styles.actionList}>Share</li>
                </ul>
            </div>
            {showComments && 
            <div className={styles.comments}>
                <CommentWrite
                    id={props.id}
                    />
                <div className={styles.commentsContainer}>
                    {comments.map((comment) => {
                        return <Comment
                            name={comment.commenterFirstName + " " + comment.commenterLastName}
                            title="{comment.title}"
                            content={comment.content} 
                        />
                    })}
                </div>
            </div>}
            {showComments &&
            <div className={styles.moreCommentContainer}>
                <p onClick={(e) => fetchComments()}>Show More Comments</p>
            </div>}
        </div>
    )
}

function Comment(props) {
    return (
        <div className={styles.commentContainer}>
            <div className={styles.contentByPersonContainer}>
                <div className={styles.imageContainerComment}></div>
                <div>
                    <p className={styles.contentNameComment}>{props.name}</p>
                    <p className={styles.contentTitle}>{props.title}</p>
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

        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        try {
            let post = {
                id: props.id,
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
        <div className={styles.commentWriteContainer}>
            <div className={styles.imageContainerComment}></div>
            <input className={styles.commentInput} type="text" onChange={(e) => setCommentContent(e.target.value)} value={commentContent} />
            <div className={styles.commentPost} onClick={() => postComment()}>Post</div>
        </div>
    )
}