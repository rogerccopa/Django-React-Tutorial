import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method })
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method == "login" ? "Login" : "Register";

    const handleSubmit = async (evt) =>
    {
        setLoading(true);
        evt.preventDefault();

        try {
            const response = await api.post(route, {username, password});

            if (method == "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                alert("use is now logged in");
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return (
    <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
            placeholder="Username"
        />
        <input
            className="form-input"
            type="password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            placeholder="Password"
        />
        {loading && <LoadingIndicator />}
        <button type="submit" className="form-button">{name}</button>
    </form>
    );
}

export default Form
