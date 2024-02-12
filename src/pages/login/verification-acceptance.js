import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ConnectConfig from '../../config/connections.json';

function VerificationAcceptance() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const verificationToken = queryParams.get('token');
    const [busyVerify, setBusyVerify] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const URL = ConnectConfig.api_server.url + "/api/v1/verify/" + verificationToken;

        async function verify() {
            try {
                const response = await fetch(URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                if (response.ok) {
                    setVerified(true);
                    setBusyVerify(false);
                } else {
                    setBusyVerify(false);
                }
            } catch (error) {
                setBusyVerify(false);
            }
        }

        verify();

    }, []);

    return (
        <div className="login-page">
            <div className="login-container">
                {(busyVerify) ? 
                    <div>
                        <p className="login-display-text">Awaiting Verification Acceptance</p>
                    </div> : 
                    (verified) ? 
                        <div>
                            <p className="login-display-text">Account Verified</p>
                            <Link className="login-links" to={process.env.PUBLIC_URL + '/'}>Login</Link>
                        </div> : 
                        <div>
                            <p className="login-display-text">Error with Verification</p>
                            <Link className="login-links" to={process.env.PUBLIC_URL + '/'}>Login</Link>
                        </div>}
            </div>
        </div>
    )

}

export default VerificationAcceptance;