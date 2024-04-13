import { Link } from 'react-router-dom';
import styles from "./userCard.module.css";

function UserCard(props) {
    return(
    <div className={styles.userCardContainerOutside}>
        <Link to={(props.id) ? "/user/" + props.id + "/posts" : "/discover"} className={styles.userCardContainerInside}>
            <img className={styles.userCardImage} src={"data:image/jpeg;base64," + props.imageData} alt="Profile"></img>
            <div>
                <p className={styles.userCardText}>{props.firstName + " " + props.lastName}</p>
            </div>
        </Link>
    </div>)
}

export default UserCard;