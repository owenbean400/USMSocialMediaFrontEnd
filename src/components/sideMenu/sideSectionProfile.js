import UsmMiniButton from "../button/usm-mini-button";
import styles from "./sideSection.module.css";
import { useState } from "react";

export default function SideSectionProfile(props) {
    const [showGroup, setShowGroup] = useState(true);

    return(
        <div>
            <div onClick={(e) => setShowGroup(!showGroup)} className={styles.sideSectionHeader}>{props.header}</div>
            <div className={(showGroup) ? styles.sideSectionItemContainerShow : styles.sideSectionItemContainerHide}>
                <div className={styles.sideSectionProfileSection}>
                    <div className={styles.sideSectionProfileImage}>
                    </div>
                    <div className={styles.sideSectionProfileInfoContainer}>
                        <p className={styles.sideSectionProfileInfoName}>{props.name}</p>
                        <p className={styles.sideSectionProfileInfoTagLine}>{props.tagLine}</p>
                        <p>{props.bio}</p>
                        {
                            (props.isOwnProfile) ?
                            <div></div> :
                            <UsmMiniButton
                                    buttonText={props.isFollowing ? "Unfollow" : "Follow"}
                                    onClick={props.followPerson}
                                />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}