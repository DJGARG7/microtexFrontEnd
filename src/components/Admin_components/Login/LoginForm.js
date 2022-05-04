import React, { useState } from "react";
import axios from "./api/axios";
import toast from "react-hot-toast";
import styles from "./styles/LoginForm.module.css";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

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

        // Loadin toast.
        // const loginToast = toast.loading("Logging in...", toastStyle);

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

            toast.success(
                "Login successful!",
                toastStyle
                // {id: loginToast,}
            );

            // Change state to logged in.
            onLogin(
                "true",
                res.data.uuid,
                type,
                corporateID,
                userID,
                res.data.userName,
                res.data.isAdmin
            );
        } catch (error) {
            console.log(error);

            // Toast on failure.
            toast.error(
                "Login failed!",
                toastStyle
                // { id: loginToast }
            );
        }
    };

    console.log("LoginForm");

    return (
        <form className={styles["form"]} onSubmit={loginHandler}>
            <div className={styles["form--user-type"]}>
                {types.map((t) => (
                    <React.Fragment key={t}>
                        <input
                            type="radio"
                            id={t}
                            value={t}
                            checked={type === t}
                            onChange={radioHandler}
                            className={styles["form--user-type-c"]}
                        />
                        <label
                            htmlFor={t}
                            className={styles["form--user-type-c"]}
                        >
                            <span>{t}</span>
                        </label>
                    </React.Fragment>
                ))}
            </div>
            <div className={styles["form--input"]}>
                {type === "Firm" && (
                    <input
                        type="text"
                        value={corporateID}
                        placeholder="Corporate ID"
                        onChange={(e) => setCorporateID(e.target.value)}
                        className={styles["form--input-t"]}
                        required
                    />
                )}
                <input
                    type="text"
                    value={userID}
                    placeholder="User ID"
                    onChange={(e) => setUserID(e.target.value)}
                    className={styles["form--input-t"]}
                    required
                />
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className={styles["form--input-p"]}
                    required
                />
            </div>

            <div className={styles["form--remember-me"]}>
                <label htmlFor="form--remember-me">Remember me? </label>
                <input
                    type="checkbox"
                    checked={rememberUser}
                    onChange={rememberHandler}
                    id="form--remember-me"
                />
            </div>

            <button type="submit" className={styles["form--btn"]}>
                Login
            </button>
        </form>
    );
}
