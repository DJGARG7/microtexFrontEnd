import { useEffect, useState } from "react";
import { Route, Redirect, BrowserRouter as Router } from "react-router-dom";

import Login from "./components/Login/Login";
import AdminDashboard from "./components/Admin_components/AdminDashboard";
import BottomBar from "./components/BottomBar";
import UserDashboard from "./components/User_components/UserDashboard";
import axiosAuth from "./components/Login/api/axios";

import "./style.css";

function App() {
    // Storing user details in localStorage and as state.
    localStorage.getItem("userDetails") === null &&
        localStorage.setItem("userDetails", JSON.stringify({}));

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("userDetails"))
    );

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
        userName,
        isAdmin
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
                isAdmin: isAdmin,
            });

            // Setting login status.
            setIsLoggedIn("true");
        }
    };

    const logoutHandler = async () => {
        try {
            const res = await axiosAuth.get("/logout", {
                headers: {
                    userID: JSON.parse(localStorage.getItem("userDetails"))
                        .userID,
                },
            });

            // Remove user details and change login status.
            setIsLoggedIn("false");
            setUser(JSON.stringify({}));
        } catch (error) {
            console.log(error);

            // <Redirect to="/login" />;
            setIsLoggedIn("false");
            setUser(JSON.stringify({}));
        }
    };
    return (
        <>
            <div className="logo">
                <h1>MicroTex</h1>
            </div>
            <Router>
                <Route path="/login">
                    <Login onLogin={loginHandler} />
                </Route>
                <Route path="/dashboard">
                    {user.isAdmin === 1 ? (
                        <AdminDashboard
                            userDetails={user}
                            logoutHandler={logoutHandler}
                        />
                    ) : (
                        <UserDashboard
                            userDetails={user}
                            logoutHandler={logoutHandler}
                        />
                    )}
                </Route>
                <Route path="/">
                    {isLoggedIn === "true" ? (
                        <Redirect to="/dashboard" />
                    ) : (
                        <Redirect to="/login" />
                    )}
                </Route>
            </Router>
        </>
    );
}

export default App;
