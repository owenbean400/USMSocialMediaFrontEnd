import { Link } from 'react-router-dom';
import styles from "./userCard.module.css";
import { DEFAULT_URL_LOGO } from "../../helper/global";

function UserCard(props) {
    return(
    <div className={styles.userCardContainerOutside}>
        <Link to={(props.id) ? "/main/user/" + props.id + "/posts" : "/discover"} className={styles.userCardContainerInside}>
            <img className={styles.userCardImage} src={"data:image/jpeg;base64," + ((props.imageData) ? props.imageData : DEFAULT_URL_LOGO)} alt="Profile"></img>
            <div>
                <p className={styles.userCardText}>{props.firstName + " " + props.lastName}</p>
            </div>
        </Link>
    </div>)
}

export default UserCard;