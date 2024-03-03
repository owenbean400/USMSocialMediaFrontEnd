import { Link } from 'react-router-dom';
import styles from "./sideSection.module.css";
import { useState } from "react";

export default function SideSection(props) {
    const [showGroup, setShowGroup] = useState(window.innerWidth >= 960);

    return(
        <div>
            <div onClick={(e) => setShowGroup(!showGroup)} className={styles.sideSectionHeader}>{props.header}</div>
            <div className={(showGroup) ? styles.sideSectionItemContainerShow : styles.sideSectionItemContainerHide}>
                {props.items.map((item) => {
                    return(
                        <div>
                            <Link className={styles.sideSectionItem} to={item.to}>{item.title}</Link>
                        </div>)
                })}
            </div>
        </div>
    )
}