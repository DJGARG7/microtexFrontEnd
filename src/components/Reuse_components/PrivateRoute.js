import { Route } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Redirect } from "react-router-dom";

// Axios default configuration to include cookie and user ID with every request.
axios.defaults.withCredentials = true;
axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

export default function PrivateRoute({ children: Component, ...rest }) {
    const [isLoading, setIsLoading] = useState(true);

    const check = async () => {
        try {
            const res = await axios.get("http://localhost:3002/auth/check");
            console.log("We went motor racing");
            setIsLoading(false);
            return true;
        } catch (error) {
            console.log("No michael no!");
            return false;
        }
    };

    const status = check();

    console.log(Component);

    if (isLoading) return "Loading...";
    else {
        if (status === true) return <Route {...rest}>{Component}</Route>;
        else return <Redirect to="/login" />;
    }

    // return status === true && isLoading === false ? (
    //     <Route {...rest}>{Component}</Route>
    // ) : (
    //     <Redirect to="/login" />
    // );
}
