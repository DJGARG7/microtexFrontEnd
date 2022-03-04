/* eslint-disable jsx-a11y/anchor-is-valid */
import "./style.css";
import { useEffect, useState } from "react";
import Login from "./components/Login/Login";
import AdminDashboard from "./components/Admin_components/AdminDashboard";
import BottomBar from "./components/BottomBar";
import { Route, Redirect, Switch } from "react-router";
import { Toaster } from "react-hot-toast";
import axios from "axios";

function App() {
    localStorage.getItem("loggedIn") === null &&
        localStorage.setItem("loggedIn", "false");

    const [isLogged, setIsLogged] = useState(localStorage.getItem("loggedIn"));
    const [isType, setIsType] = useState("");
    const [isUser, setIsUser] = useState({
        u_id: "userId",
        name: "UserName",
        c_id: "corpId",
        token: "",
    });

    const loggedInHandler = (status, type, corpId, userId, token) => {
        if (status == "false") {
            //show appropriate message of login failed try again in red @dhairya like in php
            setIsLogged("false");
            console.log("inside");
            return;
        }
        console.log("outside");
        localStorage.setItem("loggedIn", "true");
        console.log(typeof localStorage.getItem("loggedIn"));
        setIsLogged(localStorage.getItem("loggedIn"));
        setIsType(type);
        setIsUser({ u_id: userId, token: token, c_id: corpId });
    };

    const logoutHandler = () => {
        console.log("Logout");
        localStorage.removeItem("accessToken");
        localStorage.setItem("loggedIn", "false");
        setIsLogged(localStorage.getItem("loggedIn"));
        setIsType("");
        setIsUser({ u_id: "", token: "", c_id: "" });
    };
    console.log("app.js");
    return (
        <>
            <Toaster />
            {console.log(`State: ${isLogged}`)}
            <div className="logo">MicroTex ERP Solutions</div>
            <Route path="/">
                {isLogged == "true" ? (
                    <Redirect to="/dashboard" />
                ) : (
                    <Redirect to="/login" />
                )}
            </Route>
            <Route path="/login">
                <Login onLogged={loggedInHandler} />
            </Route>
            <Route path="/dashboard">
                <AdminDashboard
                    userDetails={isUser}
                    logoutHandler={logoutHandler}
                />
            </Route>
            <BottomBar />
        </>
    );
}

export default App;
