import { useState } from "react";
import TextFieldPassword from '../../components/inputs/usm-text-field-password';
import TextFieldExtended from '../../components/inputs/usm-text-field-extended';
import Usmbutton from '../../components/button/usm-button';
import ConnectConfig from '../../config/connections.json';
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
    const [emailaddrInput, setEmailInput] = useState('');
    const [passInput, setPassInput] = useState('');
    const [confirmPassInput, setConfirmPassInput] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const navigate = useNavigate();

    function handleEmailChange(value) {
        setEmailInput(value);
    };

    function handlePassChange(value) {
        setPassInput(value);
    };

    function handleConfirmPassChange(value) {
        setConfirmPassInput(value);
    };

    async function registerAccount() {
        const URL = ConnectConfig.api_server.url + "/api/v1/auth/register";

        if (passInput !== confirmPassInput) {
            setErrMessage("Password and confirm password does not match!");
            return;
        }

        let firstName = "";
        let lastName = "";

        if (emailaddrInput.indexOf(".") !== -1) {
            let information = emailaddrInput.split(".");
            if (information.length == 2) {
                firstName = information[0];
                lastName = information[1];
            }
        }
        
        let credentials = {
            firstName: firstName,
            lastName: lastName,
            email: emailaddrInput + "@maine.edu",
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
                let data = await response.json();
                sessionStorage.setItem(ConnectConfig.api_server.session_token_id_name, data.token);
                navigate('/verify/awaiting');
            } else {
                setErrMessage('Registration error!');
            }
          } catch (error) {
            setErrMessage('Registration error!');
          }
    }

    return (
        <div className="login-page">
          <div className="login-container">
                <img className="usm-logo-top" src="https://imgs.search.brave.com/EPO1Pfw_I9IxOnuFLTFMf_y9eR2TpuWsZ_5t7ADh1Qg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91c20u/bWFpbmUuZWR1L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIyLzA3/L1VTTV9oZWFkZXJM/b2dvLnBuZw" width="380px" alt="USM Logo"></img>
                <p className="login-error-text">{errMessage}</p>
                <TextFieldExtended labelText="Email Address" labelExtenstion="@maine.edu" onChange={handleEmailChange}/>
                <TextFieldPassword labelText="Password" onChange={handlePassChange}/>
                <TextFieldPassword labelText="Confirm Password" onChange={handleConfirmPassChange}/>
                <Usmbutton buttonText="Register" onClick={registerAccount}/>
                <Link className="login-links" to={'/'}>Back</Link>
            </div>
        </div>
    )
}

export default RegisterPage;
