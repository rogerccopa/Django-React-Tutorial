import {Navigatge} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState } from "react"

function ProtectedRoute({children}) {
    const {isAuthorized, setIsAuthorized} = useState(null);

    const refreshToken = async () => {
        const refreshTotken = localSTorage.getItem(REFRESH_TOKEN);

        try {
            const response = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });

            if (response.status == 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAutholrized(true);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        // convert from milliseconds to seconds (/ 1000)
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);  
        }
    }

    if (isAuthorized == null) {
        return <div>Loading....</div>;
    }

    return isAuthorized ? children : <Navigatge to="/login" />;
}

export default ProtectedRoute;
