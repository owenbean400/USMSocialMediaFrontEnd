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
    const [imageFileBase64, setImageFileBase64] = useState("");
    const navigate = useNavigate();

    function startsWithJpehImageData(str) {
        return str.startsWith("data:image/jpeg;base64,") || str.startsWith("data:image/jpg;base64,");
    }

    async function onFileChange(event) {
        if (event.currentTarget.files[0] !== undefined) {
            let base64 = await getBase64(event.currentTarget.files[0]);
            if (startsWithJpehImageData(base64)) {
                let uploadSuccess = await uploadFile(base64.split(",")[1]);
                if (uploadSuccess) {
                    setImageFileBase64(base64.split(",")[1]);
                }
            } else {
                setUpdateMsg("File must be jpg or jpeg!");
            }
        }
    }

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async function uploadFile(base64) {
        console.log(base64);

        if (base64 !== "") {
            console.log("uploading!");
            const URL = ConnectConfig.api_server.url + "/api/v1/user/profile_picture";

            let body = {
                imageBase64: base64
            };

            try {
                const response = await fetch (URL, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                });

                if (response.ok) {
                    setUpdateMsg("Updated Profile!");
                    return true;
                } else {
                    setUpdateMsg("Error! Could not update profile picture!");
                }
            } catch (error) {
                setUpdateMsg("Error! Could not update profile picture!");
            }
        } else {
            console.log("not uploading!");
        }

        return false;
    }

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);
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
                        setImageFileBase64(data["user"]["base64Image"])
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
            <NavBar
               imageData={imageFileBase64}/>
            <div className={styles.profileContainer}>
                <div className={styles.profileSection}>
                    <div className={styles.profileSectionLeft}>
                        <img className={styles.profileSectionImage} src={"data:image/jpeg;base64," + imageFileBase64} alt="Profile"></img>
                        <label 
                            for="file-upload" 
                            className={styles.fileUploadButton}>
                                Upload Picture
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={onFileChange} />
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