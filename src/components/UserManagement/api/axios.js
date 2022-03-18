import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3002/auth",
    withCredentials: true,
    headers: {
        userID: JSON.parse(localStorage.getItem("userDetails")).userID,
    },
});
