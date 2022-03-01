import React, { useEffect, useState } from "react";
import RecentUserList from "./RecentUserList";
import "../styles/Login.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Login = ({ onLogged }) => {
    const [savedFirm, setSavedFirm] = useState(
        JSON.parse(localStorage.getItem("savedFirm"))
    );
    const [savedPro, setSavedPro] = useState(
        JSON.parse(localStorage.getItem("savedPro"))
    );
    const [remember, setRemember] = useState(false);
    const [corpId, setCorpId] = useState("");
    const [userId, setUserId] = useState("");
    const [type, setType] = useState("firm");

    const types = ["firm", "proprietor"];

    // console.log(type);

    const savedClickHandler = (c_id, u_id) => {
        // console.log(c_id, u_id);
        setCorpId(c_id);
        setUserId(u_id);
        setType("firm");
        setRemember(true);
    };

    const savedProClickHandler = (u_id) => {
        // console.log(u_id);
        setUserId(u_id);
        setType("proprietor");
        setRemember(true);
    };

    const onChangeHandler = () => {
        setRemember(!remember);
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
                        userID: userId,
                        password: document.getElementById("password").value,
                    }
                );

                console.log(res.data.userID);
                console.log(res.data.accessToken);
                localStorage.setItem("accessToken",res.data.accessToken);

                // Toast on success.
                toast.success("Logged in successfully!", {
                    style: {
                        borderRadius: "15px",
                        background: "#333",
                        color: "#fff",
                    },
                });

                // Save user in recents list if the user chooses so.
                var UserName = "fromBackend";

                if (remember) {
                    // name in prompt remaining
                    if (type === "proprietor" && !(userId in savedPro)) {
                        localStorage.setItem(
                            "savedPro",
                            JSON.stringify({
                                [userId]: { name: UserName, u_id: userId },
                                ...savedPro,
                            })
                        );
                        setSavedPro({
                            [userId]: { name: UserName, u_id: userId },
                            ...savedPro,
                        });
                        console.log(savedPro);
                    } else if (
                        type !== "proprietor" &&
                        !(userId in savedFirm) &&
                        corpId !== ""
                    ) {
                        localStorage.setItem(
                            "savedFirm",
                            JSON.stringify({
                                [userId]: {
                                    c_id: corpId,
                                    name: UserName,
                                    u_id: userId,
                                },
                                ...savedFirm,
                            })
                        );
                        setSavedFirm({
                            [userId]: {
                                c_id: corpId,
                                name: UserName,
                                u_id: userId,
                            },
                            ...savedFirm,
                        });
                        console.log(savedFirm);
                    }
                }

                // Change state to logged in.
                onLogged(true, type, corpId, userId, res.data.accessToken);
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

    const radiohandler = (event) => {
        setType(event.currentTarget.value);
        setUserId("");
        setCorpId("");
    };
    return (
        <React.Fragment>
            <Toaster />
            <div className="mainParent">
                <div className="blackbox">
                    <div className="leftPart">
                        <h2>Saved Users</h2>
                        <RecentUserList
                            savedFirm={savedFirm}
                            savedPro={savedPro}
                            setSavedFirm={setSavedFirm}
                            setSavedPro={setSavedPro}
                            savedClickHandler={savedClickHandler}
                            savedProClickHandler={savedProClickHandler}
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
                                                name="type"
                                                id={t}
                                                value={t}
                                                checked={type === t}
                                                onChange={radiohandler}
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
                                        name="cid"
                                        value={corpId}
                                        placeholder="Corporate ID"
                                        onChange={(e) =>
                                            setCorpId(e.target.value)
                                        }
                                        required
                                    />
                                )}
                                <input
                                    type="text"
                                    name="uid"
                                    value={userId}
                                    placeholder="User ID"
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    // onChange={(e) => setUserId(e.target.value)}
                                    required
                                />
                                <div className="rememberMe">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={onChangeHandler}
                                        name="remember"
                                    />{" "}
                                    Remember me
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-login"
                                    value="LOGIN"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default Login;
