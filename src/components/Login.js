import { useEffect, useState } from "react";
import "../styles/Login.css";
const Login = ({ OnLogged }) => {
    const [savedFirm, setSavedFirm] = useState(
        JSON.parse(localStorage.getItem("savedFirm"))
    );
    const [savedPro, setSavedPro] = useState(
        JSON.parse(localStorage.getItem("savedPro"))
    );
    const [remember, setRemember] = useState(false);

    const [corpId, setCorpId] = useState();
    const [userId, setUserId] = useState();
    const [type, setType] = useState("firm");

    const types = ["firm", "proprietor"];
    const savedClickHandler = (c_id, u_id) => {
        console.log(c_id, u_id);
        setCorpId(c_id);
        setUserId(u_id);
        setType("firm");
        setRemember(true);
    };
    const savedProClickHandler = (u_id) => {
        console.log(u_id);
        setUserId(u_id);
        setType("proprietor");
        setRemember(true);
    };
    const onChangeHandler = () => {
        setRemember(!remember);
    };
    const loginHandler = (event) => {
        event.preventDefault();
        // authenticate with backend and fetch the type from {admin,user,proprietor} and name
		//if auth fails uncomment below for testing and comment OnLogged(true...)
		//OnLogged(false,"","","","")
        //else continue with below code
        //setType("frombackend") setName
		var UserName = "fromBackend"
        //dummy code for setType
        type === "firm" && setType("admin");
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
        OnLogged(true, type, corpId, userId,UserName);
    };
    const radiohandler = (event) => {
        setType(event.currentTarget.value);
        setUserId("");
        setCorpId("");
    };
    return (
        <div className="mainParent">
            <div className="blackbox">
                <div className="leftPart">
                    <h2>Saved Users</h2>
                    <div className="recentUserList">
                        {Object.keys(savedFirm).map((ele) => {
                            return (
                                <button
                                    className="savedFirm"
                                    onClick={() =>
                                        savedClickHandler(
                                            savedFirm[ele].c_id,
                                            savedFirm[ele].u_id
                                        )
                                    }
                                >
                                    <div className="delete-firm">✗</div>
                                    <div className="firm-name">
                                        {savedFirm[ele].name}
                                    </div>
                                    <div className="firm-id">
                                        <div>{savedFirm[ele].c_id}</div>
                                        <div>{savedFirm[ele].u_id}</div>
                                    </div>
                                </button>
                            );
                        })}
                        {Object.keys(savedPro).map((ele) => {
                            return (
                                <button
                                    className="savedPro"
                                    onClick={() =>
                                        savedProClickHandler(savedPro[ele].u_id)
                                    }
                                >
                                    <div className="delete-firm">✗</div>
                                    <div className="firm-name">
                                        {savedPro[ele].name}
                                    </div>
                                    <div className="firm-id">
                                        <div>{savedPro[ele].u_id}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="rightPart">
                    <h2>Login</h2>
                    <div className="form">
                        <form onSubmit={loginHandler}>
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
                                    onChange={(e) => setCorpId(e.target.value)}
                                    required
                                />
                            )}
                            <br />
                            <input
                                type="text"
                                name="uid"
                                value={userId}
                                placeholder="User ID"
                                onChange={(e) => setUserId(e.target.value)}
                                required
                            />
                            <br />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                            <br />
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={onChangeHandler}
                                name="remember"
                            />{" "}
                            Remember me
                            <button
                                type="submit"
                                className="btn btn-login"
                                value="LOGIN"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
