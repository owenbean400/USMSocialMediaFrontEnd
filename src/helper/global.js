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

async function getApiCall(token, url, navigateUnauthorized) {
    const URL = ConnectConfig.api_server.url + url;

    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
        }

        if (response.status === 401) {
            navigateUnauthorized("/");
        }

    } catch (error) {
        // Returns error
    }

    return undefined;
}

async function postApiCall(token, url, navigateUnauthorized, body) {
    const URL = ConnectConfig.api_server.url + url;

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            return await response.json();
        }

        if (response.status === 401) {
            navigateUnauthorized("/");
        }

    } catch (error) {
        // Returns error
    }

    return undefined;
}

export { getBase64Image, getApiCall, postApiCall };