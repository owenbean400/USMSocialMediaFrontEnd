import styles from "./posts.module.css";
import { useState } from 'react';


export default function Post(props) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([{ name: "Owen Bean", title: "Greatest Person", content: "Wow so Cool!"}]);

    function displayComment() {
        if (comments.length === 0 && !showComments) {
            fetchComments();
        }

        setShowComments(!showComments);
    }

    function fetchComments() {
        // TODO: Fetch 5 comments or all if not enough
        let fetchedComments = [
            {
                name: "Abby Pitcairn",
                title: "CS Student",
                content: "Amazing!"
            },
            {
                name: "Michael Yattaw",
                title: "CS Student",
                content: "Hmmmmm....."
            }
        ];

        const newComments = [...comments, ...fetchedComments];

        setComments(newComments);
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
                <p className={styles.actionItemInfo} onClick={(e) => displayComment()}>{props.comments} Comment{(props.comments) === 1 ? "" : "s"}</p>
            </div>
            <div className={styles.actionContainer}>
                <ul className={styles.actionListContainer}>
                    <li className={styles.actionList}>Like</li>
                    <div className={styles.barBlock}></div>
                    <li className={styles.actionList} onClick={(e) => displayComment()}>Comment</li>
                    <div className={styles.barBlock}></div>
                    <li className={styles.actionList}>Share</li>
                </ul>
            </div>
            {showComments && 
            <div className={styles.comments}>
                <CommentWrite/>
                <div className={styles.commentsContainer}>
                    {comments.map((comment) => {
                        return <Comment
                            name={comment.name}
                            title={comment.title}
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
    return(
        <div className={styles.commentWriteContainer}>
            <div className={styles.imageContainerComment}></div>
            <input className={styles.commentInput} type="text" onChange={(e) => props.onChange(e.target.value)} />
            <div className={styles.commentPost}>Post</div>
        </div>
    )
}