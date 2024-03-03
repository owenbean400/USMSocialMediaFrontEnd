import { Link } from 'react-router-dom';
import styles from "./navbar.module.css";

export default function NavBar() {
    return (<div>
        <nav className={styles.navbarContainer}>
            <div className={styles.navbarLeftContainer}>
                <img className={styles.navbarLogo} src="https://d2jyir0m79gs60.cloudfront.net/college/logos_compressed/University_of_Southern_Maine.png"></img>
                <Link className={styles.navbarLink} to={"/main"}>Feed</Link>
                <Link className={styles.navbarLink} to={"/classmates"}>Classmates</Link>
                <Link className={styles.navbarLink} to={"/groups"}>Groups</Link>
            </div>
            <div className={styles.navbarProfile}></div>
        </nav>
    </div>)
}