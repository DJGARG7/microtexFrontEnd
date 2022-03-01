import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import RecentUserList from "./RecentUserList";
import "./styles/Login.css";

export default function Login({ onLogged }) {
    const [rememberUser, setRememberUser] = useState(false);

    const [corporateID, setCorporateID] = useState("");
    const [userID, setUserID] = useState("");
    const [type, setType] = useState("firm");

    const types = ["firm", "proprietor"];

    const savedFirmHandler = (c_id, u_id) => {
        setCorporateID(c_id);
        setUserID(u_id);
        setType("firm");
        setRememberUser(true);
    };

    const savedProprietorHandler = (u_id) => {
        setUserID(u_id);
        setType("proprietor");
        setRememberUser(true);
    };

    const rememberHandler = () => {
        setRememberUser(!rememberUser);
    };

    const radioHandler = (event) => {
        setType(event.currentTarget.value);
        setUserID("");
        setCorporateID("");
    };

    const loginHandler = async (event) => {
        // Prevent refreshing the page
        event.preventDefault();

        // Check user type.
        if (type === "proprietor") {
            try {
                // Send request to backend.
                const res = await axios.post(
                    "http://localhost:3002/user/login",
                    {
                        userType: "proprietor",
                        userID: userID,
                        password: document.getElementById("password").value,
                    }
                );

                // Save user in recents list if the user chooses so.
                var UserName = "fromBackend";

                if (rememberUser) {
                    const savedProprietors = JSON.parse(
                        localStorage.getItem("savedPro")
                    );

                    // name in prompt remaining
                    if (!(userID in savedProprietors)) {
                        localStorage.setItem(
                            "savedPro",
                            JSON.stringify({
                                [userID]: { name: UserName, u_id: userID },
                                ...savedProprietors,
                            })
                        );
                    }
                }

                // Change state to logged in.
                onLogged(true, type, corporateID, userID, res.data.accessToken);
            } catch (err) {
                // Toast on failure.
                toast.error("Log in failed!", {
                    style: {
                        borderRadius: "15px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
        } else if (type === "firm") {
            try {
                // Send request to backend.
                const res = await axios.post(
                    "http://localhost:3002/user/login",
                    {
                        userType: "firm",
                        corporateID: corporateID,
                        userID: userID,
                        password: document.getElementById("password").value,
                    }
                );

                // Save user in recents list if the user chooses so.
                var UserName = "fromBackend";

                if (rememberUser) {
                    const savedFirms = JSON.parse(
                        localStorage.getItem("savedFirm")
                    );

                    // name in prompt remaining
                    if (!(userID in savedFirms)) {
                        localStorage.setItem(
                            "savedFirm",
                            JSON.stringify({
                                [userID]: {
                                    name: UserName,
                                    c_id: corporateID,
                                    u_id: userID,
                                },
                                ...savedFirms,
                            })
                        );
                    }
                }

                // Change state to logged in.
                onLogged(
                    "true",
                    type,
                    corporateID,
                    userID,
                    res.data.accessToken
                );
            } catch (err) {
                // Toast on failure.
                toast.error("Log in failed!", {
                    style: {
                        borderRadius: "15px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
        }
    };

    return (
        <>
            <Toaster />
            <div className="mainParent">
                <div className="blackbox">
                    <div className="leftPart">
                        <h2>Saved Users</h2>
                        <RecentUserList
                            savedFirmHandler={savedFirmHandler}
                            savedProprietorHandler={savedProprietorHandler}
                        />
                    </div>
                    <div className="rightPart">
                        <h2>Login</h2>
                        <form onSubmit={loginHandler}>
                            <div className="form">
                                <div className="switch-field">
                                    {types.map((t) => (
                                        <>
                                            <input
                                                type="radio"
                                                id={t}
                                                value={t}
                                                checked={type === t}
                                                onChange={radioHandler}
                                            />
                                            <label htmlFor={t}>
                                                <span>{t}</span>
                                            </label>
                                        </>
                                    ))}
                                </div>
                                {type === "firm" && (
                                    <input
                                        type="text"
                                        value={corporateID}
                                        placeholder="Corporate ID"
                                        onChange={(e) =>
                                            setCorporateID(e.target.value)
                                        }
                                        required
                                    />
                                )}
                                <input
                                    type="text"
                                    value={userID}
                                    placeholder="User ID"
                                    onChange={(e) => setUserID(e.target.value)}
                                    required
                                />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                />

                                <div className="rememberMe">
                                    <input
                                        type="checkbox"
                                        checked={rememberUser}
                                        onChange={rememberHandler}
                                        name="remember"
                                    />{" "}
                                    Remember me
                                </div>
                                <button type="submit" className="btn btn-login">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
