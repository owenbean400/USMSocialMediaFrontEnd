import './login-page.css';
import React, { useEffect, useState } from 'react';
import TextFieldPassword from '../../components/inputs/usm-text-field-password';
import TextFieldExtended from '../../components/inputs/usm-text-field-extended';
import Usmbutton from '../../components/button/usm-button';
import ConnectConfig from '../../config/connections.json';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function LoginPage(props) {
  const [emailaddrInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const navigate = useNavigate()
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

    console.log(props.previousUrl);

    async function getPosts(token_input) {
        const URL = ConnectConfig.api_server.url + "/api/v1/post/recommended";

        try {
            const response = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token_input}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                if (props.previousUrl.includes("main")) {
                  let previousUrl = props.previousUrl;
                  props.setUrl(() => "");
                  navigate(previousUrl);
                } else {
                  navigate('/main/feed');
                }
            } else {
              localStorage.removeItem(ConnectConfig.api_server.session_token_id_name);
            }
        } catch (error) {
          localStorage.removeItem(ConnectConfig.api_server.session_token_id_name);
        }
    }

    if (tokenFromStorage) {
      getPosts(tokenFromStorage);
    }
  }, [dispatch, navigate, props]);

  function handleEmailChange(value) {
    setEmailInput(value);
  };

  function handlePassChange(value) {
    setPassInput(value);
  };

  async function clickOn() {
    const URL = ConnectConfig.api_server.url + "/api/v1/auth/authenticate"

    let credentials = {
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
        localStorage.setItem(ConnectConfig.api_server.session_token_id_name, data.token);
        console.log(props.previousUrl);
        if (props.previousUrl.includes("main")) {
          let previousUrl = props.previousUrl;
          props.setUrl(() => "");
          navigate(previousUrl);
        } else {
          navigate('/main/feed');
        }
      } else {
        setErrMessage('Login error!');
      }
    } catch (error) {
      setErrMessage('Login error!');
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <img className="usm-logo-top" src="https://imgs.search.brave.com/EPO1Pfw_I9IxOnuFLTFMf_y9eR2TpuWsZ_5t7ADh1Qg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly91c20u/bWFpbmUuZWR1L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIyLzA3/L1VTTV9oZWFkZXJM/b2dvLnBuZw" alt="USM Logo"></img>
        <p className="login-error-text">{ errMessage }</p>
        <TextFieldExtended labelText="Email Address" labelExtenstion="@maine.edu" onChange={handleEmailChange}/>
        <TextFieldPassword labelText=" Password" onChange={handlePassChange}/>
        <Link className="login-links" to={'/register'}>Register</Link>
        <Link className="login-links" to={'/passwordreset'}>Reset Password</Link>
        <Usmbutton buttonText="Login" onClick={clickOn}/>
      </div>
    </div>
  );
}

export default LoginPage;
