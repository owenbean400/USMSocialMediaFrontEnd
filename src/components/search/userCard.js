import { Link } from 'react-router-dom';
import styles from "./userCard.module.css";

function UserCard(props) {
    return(
    <div className={styles.userCardContainerOutside}>
        <Link to={(props.id) ? "/user/" + props.id : "/discover"} className={styles.userCardContainerInside}>
            <div className={styles.userCardImage}></div>
            <div>
                <p className={styles.userCardText}>{props.firstName + " " + props.lastName}</p>
            </div>
        </Link>
    </div>)
}

export default UserCard;