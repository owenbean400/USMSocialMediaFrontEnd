import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import ConnectConfig from '../config/connections.json';
import NavBar from "../components/nav/navbar";
import { getBase64Image } from "../helper/global";

function OutsideWindow() {
    const [profilePicture, setProfilePicture] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem(ConnectConfig.api_server.session_token_id_name);

        if (!tokenFromStorage) {
            navigate("/");
        }

        if (profilePicture === "") {
            getBase64Image(tokenFromStorage).then((value) => {
                setProfilePicture(value);
            });
        }
    })

    return (
        <div>
            <NavBar 
                imageData={profilePicture} />
            <Outlet context={[profilePicture, setProfilePicture]}/>
        </div>
    )
}

export default OutsideWindow;