import { Link } from 'react-router-dom';
import styles from "./navbar.module.css";

export default function NavBar(props) {
    return (<div>
        <nav className={styles.navbarContainer}>
            <div className={styles.navbarLeftContainer}>
                <Link className={styles.navbarLink} to={"/main/feed"}>Feed</Link>
                <Link className={styles.navbarLink} to={"/main/discover"}>Users</Link>
            </div>
            <Link to={"/main/profile"} className={styles.navbarProfileLink}><img className={styles.navbarProfile} src={"data:image/jpeg;base64," + props.imageData} alt="Profile"></img></Link>
        </nav>
    </div>)
}