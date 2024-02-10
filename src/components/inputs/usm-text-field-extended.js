import styles from "./usm-text-field.module.css";

export default function TextFieldExtended(props) {
    return (
        <div className={styles.textFieldContainer}>
            <p className={styles.textFieldLabel}>{props.labelText}:</p>
            <div className={styles.textFieldInputContainer}>
                <input className={styles.textFieldInputLeft} type="text" onChange={(e) => props.onChange(e.target.value)}/>
                <div className={styles.textFieldDisplayRight}>{props.labelExtenstion}</div>
            </div>
        </div>
    );
}