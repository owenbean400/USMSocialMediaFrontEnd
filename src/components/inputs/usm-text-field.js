import styles from "./usm-text-field.module.css";

export default function TextField(props) {
    return (
        <div className={styles.textFieldContainer}>
            <p className={styles.textFieldLabel}>{props.labelText}:</p>
            <input className={styles.textFieldInput} maxlength={props.maxlength || undefined} type="text" onChange={(e) => props.onChange(e.target.value)} value={props.value} />
        </div>
    );
}