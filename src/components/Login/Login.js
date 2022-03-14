import React, { useState } from "react";
import RecentUserList from "./RecentUserList";
import LoginForm from "./LoginForm";
// import "./styles/Login.css";
import { Toaster } from "react-hot-toast";

import styles from "./styles/Login.module.css";

export default function Login({ onLogin }) {
    const [corporateID, setCorporateID] = useState("");
    const [userID, setUserID] = useState("");
    const [type, setType] = useState("Firm");

    const [rememberUser, setRememberUser] = useState(false);

    const rememberHandler = () => {
        setRememberUser(!rememberUser);
    };

    const savedFirmHandler = (c_id, u_id) => {
        setCorporateID(c_id);
        setUserID(u_id);
        setType("Firm");
        setRememberUser(true);
    };

    const savedProprietorHandler = (u_id) => {
        setUserID(u_id);
        setType("Proprietor");
        setRememberUser(true);
    };

    return (
        <>
            <Toaster />
            <div className={styles["body"]}>
                <div className={styles["left"]}>
                    <h2 className={styles["left--title"]}>Saved Users</h2>
                    <RecentUserList
                        savedFirmHandler={savedFirmHandler}
                        savedProprietorHandler={savedProprietorHandler}
                    />
                </div>
                <div className={styles["right"]}>
                    <h2 className={styles["right--title"]}>Login</h2>
                    <LoginForm
                        rememberUser={rememberUser}
                        rememberHandler={rememberHandler}
                        type={type}
                        setType={setType}
                        corporateID={corporateID}
                        setCorporateID={setCorporateID}
                        userID={userID}
                        setUserID={setUserID}
                        onLogin={onLogin}
                    />
                </div>
            </div>
        </>
    );
}
