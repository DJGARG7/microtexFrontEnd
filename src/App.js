/* eslint-disable jsx-a11y/anchor-is-valid */
import "./style.css";
import { useEffect, useState } from "react";
import Login from "./components/Login/Login";
import AdminDashboard from "./components/Admin_components/AdminDashboard";
import BottomBar from "./components/BottomBar";
function App() {
    localStorage.getItem("savedPro") === null &&
        localStorage.setItem("savedPro", JSON.stringify({}));
    localStorage.getItem("savedFirm") === null &&
        localStorage.setItem("savedFirm", JSON.stringify({}));

    const [isLogged, setIsLogged] = useState(true);
    const [isType, setIsType] = useState();
    const [isUser, setIsUser] = useState({
        u_id: "userId",
        name: "UserName",
        c_id: "corpId",
        token: "",
    });

    const loggedInHandler = (status, type, corpId, userId, token) => {
        if (status === "fail") {
            //show appropriate message of login failed try again in red @dhairya like in php
            setIsLogged("false");
            console.log("inside");
            return;
        }
        console.log("outside");
        setIsLogged(status);
        setIsType(type);
        setIsUser({ u_id: userId, token: token, c_id: corpId });
    };

    const logoutHandler = () => {
        console.log("Logout");
        setIsLogged(false);
        setIsType("");
        setIsUser({ u_id: "", token: "", c_id: "" });
        window.location.reload();
    };
    console.log("app.js");
    return (
        <div>
            <div className="logo">MicroTex ERP Solutions</div>
            {!isLogged && <Login onLogged={loggedInHandler} />}
            {isLogged && (
                <AdminDashboard
                    userDetails={isUser}
                    logoutHandler={logoutHandler}
                />
            )}
            {/* <AdminDashboard
                    userDetails={isUser}
                    logoutHandler={logoutHandler}
                /> */}
            <BottomBar />
        </div>
    );
}

export default App;
