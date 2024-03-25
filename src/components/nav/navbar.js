import { Link } from 'react-router-dom';
import styles from "./navbar.module.css";

export default function NavBar() {
    return (<div>
        <nav className={styles.navbarContainer}>
            <div className={styles.navbarLeftContainer}>
                <Link className={styles.navbarLink} to={"/main"}>Feed</Link>
                <Link className={styles.navbarLink} to={"/discover"}>Users</Link>
            </div>
            <Link className={styles.navbarProfile} to={"/profile"}></Link>
        </nav>
    </div>)
}