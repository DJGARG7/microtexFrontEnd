import { useEffect, useState } from "react";
import { Route, Redirect } from "react-router";

import Login from "./components/Login/Login";
import AdminDashboard from "./components/Admin_components/AdminDashboard";
import BottomBar from "./components/BottomBar";

import axiosAuth from "./components/Login/api/axios";

import "./style.css";

function App() {
    // Storing user details in localStorage and as state.
    localStorage.getItem("userDetails") === null &&
        localStorage.setItem("userDetails", "");

    const [user, setUser] = useState(localStorage.getItem("userDetails"));

    // Storing login status in localStorage and as state.
    localStorage.getItem("isLoggedIn") === null &&
        localStorage.setItem("isLoggedIn", "false");

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn")
    );

    // Change localStorage with state changes.
    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
        localStorage.setItem("userDetails", JSON.stringify(user));
    }, [user]);

    const loginHandler = (
        status,
        uuid,
        type,
        corporateID,
        userID,
        userName
    ) => {
        if (status === "false") {
            setIsLoggedIn("false");
        } else {
            // Setting user details.
            setUser({
                uuid: uuid,
                type: type,
                corporateID: corporateID,
                userID: userID,
                userName: userName,
            });

            // Setting login status.
            setIsLoggedIn("true");
        }
    };

    const logoutHandler = () => {
        const res = axiosAuth.get("/logout", {
            headers: {
                userID: localStorage.getItem("userDetails").userID,
            },
        });

        console.log(res);

        // Remove user details and change login status.
        setIsLoggedIn("false");
        setUser("");
    };
    return (
        <>
            {console.log(`State: ${isLoggedIn}`)}
            <div className="logo">MicroTex ERP Solutions</div>
            <Route path="/">
                {isLoggedIn === "true" ? (
                    <Redirect to="/dashboard" />
                ) : (
                    <Redirect to="/login" />
                )}
            </Route>
            <Route path="/login">
                <Login onLogin={loginHandler} />
            </Route>
            <Route path="/dashboard">
                <AdminDashboard
                    userDetails={user}
                    logoutHandler={logoutHandler}
                />
            </Route>
            <BottomBar />
        </>
    );
}

export default App;
