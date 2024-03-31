import ConnectConfig from '../config/connections.json';

async function getBase64Image(token) {
    if (!token) {
        return "";
    }

    const URL =  ConnectConfig.api_server.url + "/api/v1/user/profile_picture";

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            let data = await response.json();

            return data.imageBase64;
        }
    } catch (error) {

    }
    
    return "";
}

export { getBase64Image };