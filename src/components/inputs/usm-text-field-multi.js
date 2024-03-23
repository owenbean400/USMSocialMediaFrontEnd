import styles from "./usm-text-field.module.css";

export default function TextFieldMulti(props) {
    return (
        <div className={styles.textFieldContainer}>
            <p className={styles.textFieldLabel}>{props.labelText}:</p>
            <textarea className={styles.textFieldInputMulti} maxlength={props.maxlength} cols={props.cols} rows={props.rows} type="text" onChange={(e) => props.onChange(e.target.value)} value={props.value} />
        </div>
    );
}