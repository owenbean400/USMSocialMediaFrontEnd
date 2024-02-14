import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import TextFieldPassword from '../../components/inputs/usm-text-field-password';
import Usmbutton from '../../components/button/usm-button';
import ConnectConfig from '../../config/connections.json';

function PasswordChange() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');
    const emailAddress = queryParams.get('email');
    const [passInput, setPassInput] = useState('');
    const [confirmPassInput, setConfirmPassInput] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const navigate = useNavigate()

    function handlePassChange(value) {
        setPassInput(value);
    };

    function handleConfirmPassChange(value) {
        setConfirmPassInput(value);
    };

    async function registerAccount() {
        const URL = ConnectConfig.api_server.url + "/api/v1/change_password/" + resetToken;

        if (passInput !== confirmPassInput) {
            setErrMessage("Password and confirm password does not match!");
        }
        
        let credentials = {
            email: emailAddress + "@maine.edu",
            password: passInput
        }

        try {
            const response = await fetch(URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(credentials)
            });
      
            if (response.ok) {
                navigate('/');
            } else {
                setErrMessage('Reset password error!');
            }
          } catch (error) {
            setErrMessage('Reset password error!');
          }
    }

    return (
        <div className="login-page">
          <div className="login-container">
                <img className="usm-logo-top" src="https://imgs.search.brave.com/EPO1Pfw_I9IxOnuFLTFMf_y9eR2TpuWsZ_5t7ADh1Qg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91c20u/bWFpbmUuZWR1L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIyLzA3/L1VTTV9oZWFkZXJM/b2dvLnBuZw" width="380px"></img>
                <p>{errMessage}</p>
                <p className="login-display-text">Reset for {emailAddress}@maine.edu</p>
                <TextFieldPassword labelText="Password" onChange={handlePassChange}/>
                <TextFieldPassword labelText="Confirm Password" onChange={handleConfirmPassChange}/>
                <Usmbutton buttonText="Reset Password" onClick={registerAccount}/>
                <Link className="login-links" to={'/'}>Back</Link>
            </div>
        </div>
    )
}

export default PasswordChange;