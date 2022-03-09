import React, { useState } from "react";
import axios from "./api/axios";
import toast from "react-hot-toast";

export default function LoginForm({
    rememberUser,
    rememberHandler,
    type,
    setType,
    corporateID,
    setCorporateID,
    userID,
    setUserID,
    onLogin,
}) {
    const types = ["Firm", "Proprietor"];

    const radioHandler = (event) => {
        setType(event.currentTarget.value);
        setUserID("");
        setCorporateID("");
    };

    const loginHandler = async (event) => {
        // Prevent refreshing the page
        event.preventDefault();

        // Send request to backend.
        try {
            const res = await axios.post("/login", {
                userType: type === "Proprietor" ? "proprietor" : "firm",
                ...(type === "Firm" && { corporateID: corporateID }),
                userID: userID,
                password: document.getElementById("password").value,
            });

            // Save user in recent user list if they choose to.
            if (rememberUser) {
                if (type === "Proprietor") {
                    const savedProprietors = JSON.parse(
                        localStorage.getItem("savedProprietors")
                    );

                    // name in prompt remaining
                    if (!(userID in savedProprietors)) {
                        localStorage.setItem(
                            "savedProprietors",
                            JSON.stringify({
                                [userID]: {
                                    name: res.data.userName,
                                    u_id: userID,
                                },
                                ...savedProprietors,
                            })
                        );
                    }
                } else if (type === "Firm") {
                    const savedFirms = JSON.parse(
                        localStorage.getItem("savedFirms")
                    );

                    // name in prompt remaining
                    if (!(userID in savedFirms)) {
                        localStorage.setItem(
                            "savedFirms",
                            JSON.stringify({
                                [userID]: {
                                    name: res.data.userName,
                                    c_id: corporateID,
                                    u_id: userID,
                                },
                                ...savedFirms,
                            })
                        );
                    }
                }
            }

            // Change state to logged in.
            onLogin(
                "true",
                res.data.uuid,
                type,
                corporateID,
                userID,
                res.data.userName
            );
        } catch (error) {
            console.log(error);

            // Toast on failure.
            toast.error("Log in failed!", {
                style: {
                    borderRadius: "15px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    };

    return (
        <form onSubmit={loginHandler}>
            <div className="form">
                <div className="switch-field">
                    {types.map((t) => (
                        <React.Fragment key={t}>
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
                        </React.Fragment>
                    ))}
                </div>
                {type === "Firm" && (
                    <input
                        type="text"
                        value={corporateID}
                        placeholder="Corporate ID"
                        onChange={(e) => setCorporateID(e.target.value)}
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
                        id="rememberMe"
                    />
                    <label htmlFor="rememberMe">Remember me?</label>
                </div>
                <button type="submit" className="btn btn-login">
                    Login
                </button>
            </div>
        </form>
    );
}
