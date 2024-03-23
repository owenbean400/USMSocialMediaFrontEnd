import styles from "./usm-button.module.css";

export default function UsmMiniButton(props) {
    return (
        <div className={styles.buttonMiniContainer}>
            <button className={styles.usmMiniButton} onClick={props.onClick}>{props.buttonText}</button>
        </div>
    );
}