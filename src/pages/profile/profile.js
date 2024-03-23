import ConnectConfig from '../../config/connections.json';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/nav/navbar";
import TextField from '../../components/inputs/usm-text-field';
import TextFieldMulti from '../../components/inputs/usm-text-field-multi';
import Usmbutton from '../../components/button/usm-button';
import styles from "./profile.module.css";

function Profile() {
    const [token, setToken] = useState('');
    const [updateMsg, setUpdateMsg] = useState('');
    const [profileData, setProfileData] = useState({
        "user": {
            "id": "",
            "firstName": "",
            "lastName": "",
            "email": "",
            "tagLine": "",
            "bio": ""
        }
    });
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromStorage = sessionStorage.getItem(ConnectConfig.api_server.session_token_id_name);
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        } else {
            navigate('/');
        }

        async function getProfileInformation(token_input) {
            const URL = ConnectConfig.api_server.url + "/api/v1/user/profile";

            try {
                const response = await fetch(URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token_input}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    let data = await response.json();

                    console.log(data);

                    if (data.hasOwnProperty("user")) {
                        setProfileData({ user: data["user"] });
                    }
                } else {

                }
            } catch (error) {
            }
        }

        getProfileInformation(tokenFromStorage);
    }, [navigate]);

    async function updateProfile() {
        const URL = ConnectConfig.api_server.url + "/api/v1/user/profile";

        console.log({
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: profileData["user"]
        });

        try {
            const response = await fetch(URL, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData["user"])
            });

            if (response.ok) {
                setUpdateMsg("Updated!");
            } else {
                setUpdateMsg("Error! Could not update!");
            }
        } catch (error) {
        }
    }

    function handleFirstNameChange(value) {
        setProfileData({
            "user": {
                "id": profileData["user"]["id"],
                "firstName": value,
                "lastName": profileData["user"]["lastName"],
                "email": profileData["user"]["email"],
                "tagLine": profileData["user"]["tagLine"],
                "bio": profileData["user"]["bio"]
            }
        });
    };

    function handleLastNameChange(value) {
        setProfileData({
            "user": {
                "id": profileData["user"]["id"],
                "firstName": profileData["user"]["firstName"],
                "lastName":value,
                "email": profileData["user"]["email"],
                "tagLine": profileData["user"]["tagLine"],
                "bio": profileData["user"]["bio"]
            }
        });
    };

    function handleTaglineChange(value) {
        setProfileData({
            "user": {
                "id": profileData["user"]["id"],
                "firstName": profileData["user"]["firstName"],
                "lastName": profileData["user"]["lastName"],
                "email": profileData["user"]["email"],
                "tagLine": value,
                "bio": profileData["user"]["bio"]
            }
        });
    };

    function handleBioChange(value) {
        setProfileData({
            "user": {
                "id": profileData["user"]["id"],
                "firstName": profileData["user"]["firstName"],
                "lastName": profileData["user"]["lastName"],
                "email": profileData["user"]["email"],
                "tagLine": profileData["user"]["tagLine"],
                "bio": value
            }
        });
    };

    return (
        <div>
            <NavBar />
            <div className={styles.profileContainer}>
                <div className={styles.profileSection}>
                    <div className={styles.profileSectionLeft}>
                        <div className={styles.profileSectionImage}></div>
                    </div>
                    <div className={styles.profileSectionRight}>
                        <div>
                            <TextField
                                labelText="First Name"
                                onChange={handleFirstNameChange}
                                value={profileData["user"]["firstName"]}
                            />
                            <TextField
                                labelText="Last Name"
                                onChange={handleLastNameChange}
                                value={profileData["user"]["lastName"]}
                            />
                            <TextField
                                labelText="Tag Line"
                                onChange={handleTaglineChange}
                                value={profileData["user"]["tagLine"]}
                                maxlength={32}
                            />
                            <TextFieldMulti
                                labelText="Bio"
                                onChange={handleBioChange}
                                value={profileData["user"]["bio"]}
                                cols={32}
                                rows={3}
                                maxlength={200}
                            />
                            <p className={(updateMsg === "Updated!") ? styles.updateMsgSuccess : (updateMsg === "Error! Could not update!") ? styles.updateMsgFail : styles.updateMsgDefault}>{updateMsg}</p>
                            <Usmbutton
                                buttonText="Save Changes"
                                onClick={updateProfile}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Profile