import UsmMiniButton from "../button/usm-mini-button";
import styles from "./sideSection.module.css";
import { useState } from "react";
import { DEFAULT_URL_LOGO } from "../../helper/global";
import { useNavigate } from "react-router-dom";

export default function SideSectionProfile(props) {
    const [showGroup, setShowGroup] = useState(true);
    const navigate = useNavigate();

    function goToMessages() {
        navigate("/main/message/" + props.userId);
    }

    return(
        <div>
            <div onClick={(e) => setShowGroup(!showGroup)} className={styles.sideSectionHeader}>{props.header}</div>
            <div className={(showGroup) ? styles.sideSectionItemContainerShow : styles.sideSectionItemContainerHide}>
                <div className={styles.sideSectionProfileSection}>
                    <img className={styles.sideSectionProfileImage} src={"data:image/jpeg;base64," + ((props.imageData) ? props.imageData : DEFAULT_URL_LOGO)} alt="Profile">
                    </img>
                    <div className={styles.sideSectionProfileInfoContainer}>
                        <p className={styles.sideSectionProfileInfoName}>{props.name}</p>
                        <p className={styles.sideSectionProfileInfoTagLine}>{props.tagLine}</p>
                        <p>{props.bio}</p>
                        {
                            (props.isOwnProfile === undefined || props.isOwnProfile) ?
                            <div></div> :
                            <UsmMiniButton
                                    buttonText={props.isFollowing ? "Unfollow" : "Follow"}
                                    onClick={() => props.followPerson()}
                                />
                        }
                        {
                            (props.isOwnProfile === undefined ||props.isOwnProfile) ?
                            <div></div> :
                            <UsmMiniButton
                                    buttonText="Message"
                                    onClick={() => goToMessages()}/>
                        }
                    </div>
                    <div className={styles.userInfoDisplayContainer}>
                        <div className={styles.userInfoDisplayStat} onClick={() => props.changePage("followers")}>{(props.followersCount === undefined) ?  "" : props.followersCount} Follower{(props.followersCount > 1) ? "s" : ""}</div>
                        <div className={styles.userInfoDisplayStat} onClick={() => props.changePage("followings")}>{(props.followingsCount === undefined) ?  "" : props.followingsCount} Following{(props.followingsCount > 1) ? "s" : ""}</div>
                        <div className={styles.userInfoDisplayStat} onClick={() => props.changePage("posts")}>{(props.postsCount === undefined) ? "" : props.postsCount} Posts</div>
                    </div>
                </div>
            </div>
        </div>
    )
}