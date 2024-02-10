import styles from "./usm-text-field.module.css";
import React, { useState } from 'react';
import VisibleIconOn from '../../images/visible.svg';
import VisibleIconOff from '../../images/visible_off.svg';


export default function TextFieldPassword(props) {
    const [showPass, setShowPass] = useState(false);

    function toggleShowPass() {
        setShowPass(!showPass);
    }

    return (
        <div className={styles.textFieldContainer}>
            <p className={styles.textFieldLabel}>{props.labelText}:</p>
            <div className={styles.textFieldInputContainerPassword}>
                <input 
                    className={styles.textFieldInputLeftPassword}
                    type={showPass ? "text" : "password"}
                    onChange={(e) => props.onChange(e.target.value)}
                    maxlength={props.maxLength || 48}/>
                <div className={styles.passwordEye} onClick={(e) => toggleShowPass()}>
                    <img src={showPass ? VisibleIconOn : VisibleIconOff}></img>
                </div>
            </div>
        </div>
    );
}