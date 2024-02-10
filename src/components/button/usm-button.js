import styles from "./usm-button.module.css";

export default function Usmbutton(props) {
    return (
        <div className={styles.buttonContainer}>
            <button className={styles.usmButton} onClick={props.onClick}>{props.buttonText}</button>
        </div>
    );
}