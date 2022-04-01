import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3002/users",
    withCredentials: true,
    headers: {
        userID: localStorage.getItem("userDetails")
            ? JSON.parse(localStorage.getItem("userDetails")).userID
            : "",
    },
});
