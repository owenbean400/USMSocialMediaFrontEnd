import './login-page.css';
import React, { useState } from 'react';
import TextFieldExtended from '../../components/inputs/usm-text-field-extended';
import Usmbutton from '../../components/button/usm-button';
import ConnectConfig from '../../config/connections.json';
import { Link } from 'react-router-dom';

function PasswordReset() {
  const [emailaddrInput, setEmailInput] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [displayMessage, setdisplayMessage] = useState('');

  function handleEmailChange(value) {
    setEmailInput(value);
  };

  async function clickOn() {
    const URL = ConnectConfig.api_server.url + "/api/v1/reset_password"

    let credentials = {
      email: emailaddrInput + "@maine.edu",
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
        setdisplayMessage(data);
      } else {
        setErrMessage('Password reset error!');
      }
    } catch (error) {
      setErrMessage('Password reset error!');
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <img className="usm-logo-top" src="https://imgs.search.brave.com/EPO1Pfw_I9IxOnuFLTFMf_y9eR2TpuWsZ_5t7ADh1Qg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91c20u/bWFpbmUuZWR1L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIyLzA3/L1VTTV9oZWFkZXJM/b2dvLnBuZw"></img>
        <p>{(errMessage !== "") ? errMessage : displayMessage}</p>
        {(displayMessage == "") ?
        <div>
            <TextFieldExtended labelText="Email Address" labelExtenstion="@maine.edu" onChange={handleEmailChange}/>
            <Usmbutton buttonText="Send Reset Password" onClick={clickOn}/> 
        </div> : <div></div>}
        <Link className="login-links" to={process.env.PUBLIC_URL + '/'}>Back</Link>
      </div>
    </div>
  );
}

export default PasswordReset;
