import { useEffect, useState } from "react";
const Login = () => {
    const [savedList, setSavedList] = useState(
        JSON.parse(localStorage.getItem("saved"))
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

    return (
        <div className="blackbox">
            <div className="leftPart">
                <h2>Saved Users</h2>
                <div className="recentUserList">
                    {Object.keys(savedList).map((ele) => {
                        return (
                            <button
                                className="savedList"
                                onClick={() =>
                                    savedClickHandler(
                                        savedList[ele].c_id,
                                        savedList[ele].u_id
                                    )
                                }
                            >
                                <table>
                                    <tr>
                                        <td rowSpan={2}>
                                            {savedList[ele].name}
                                        </td>
                                        <td>{savedList[ele].c_id}</td>
                                    </tr>
                                    <tr>
                                        <td>{savedList[ele].u_id}</td>
                                    </tr>
                                </table>
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
                                <tr>
                                    <td>{savedPro[ele].name}</td>
                                    <td>{savedPro[ele].u_id}</td>
                                </tr>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="rightPart">
                <h2>Login</h2>
                <div className="form">
                    <form>
                        <div className="switch-field">
                            {types.map((t) => (
                                <>
                                    <input
                                        type="radio"
                                        name="type"
                                        id={t}
                                        value={t}
                                        checked={type === t}
                                        onChange={(e) =>
                                            setType(e.currentTarget.value)
                                        }
                                    />
                                    <label for={t}>
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
                            />
                        )}
                        <br />
                        <input
                            type="text"
                            name="uid"
                            value={userId}
                            placeholder="User ID"
                        />
                        <br />
                        <input
                            type="password"
                            name="password"
                            value=""
                            placeholder="Password"
                        />
                        <br />
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={onChangeHandler}
                            name="remember"
                        />{" "}
                        Remember me
                        <input
                            type="submit"
                            className="btn btn-login"
                            value="LOGIN"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Login;
