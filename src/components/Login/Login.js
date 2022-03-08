import React, { useState } from "react";
import RecentUserList from "./RecentUserList";
import LoginForm from "./LoginForm";
import "./styles/Login.css";
import { Toaster } from "react-hot-toast";

export default function Login({ onLogged }) {
    const [corporateID, setCorporateID] = useState("");
    const [userID, setUserID] = useState("");
    const [type, setType] = useState("Firm");

    const savedFirmHandler = (c_id, u_id) => {
        setCorporateID(c_id);
        setUserID(u_id);
        setType("Firm");
    };

    const savedProprietorHandler = (u_id) => {
        setUserID(u_id);
        setType("Proprietor");
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
                        <LoginForm
                            type={type}
                            setType={setType}
                            corporateID={corporateID}
                            setCorporateID={setCorporateID}
                            userID={userID}
                            setUserID={setUserID}
                            onLogged={onLogged}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
