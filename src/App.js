import "./style.css";
// import Modal from "./Modal";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/Admin_components/AdminDashboard";
var CryptoJS = require("crypto-js");
function App() {
    localStorage.getItem("savedPro") === null &&
        localStorage.setItem("savedPro", JSON.stringify({}));
    localStorage.getItem("savedFirm") === null &&
        localStorage.setItem("savedFirm", JSON.stringify({}));
    // var exp = {
    //     "RUT0051":{ name: "Rutvay", u_id: "RUT0051" },
    //     "DRI0058":{ name: "Digvi", u_id: "DRI0058" },
    // };
    // localStorage.setItem("savedPro", JSON.stringify(exp));
    const [isLogged, setIsLogged] = useState(true);
    const [isType, setIsType] = useState();
    const [isCorpId, setIsCorpId] = useState();
    const [isUserId, setIsUserId] = useState();
    const loggedInHandler = (status, type, corpId, userId) => {
        setIsLogged(status);
        setIsType(type);
        setIsCorpId(corpId);
        setIsUserId(userId);
        //backend name
        var name = "dummy name";
    };
    return (
        <div>
            <div className="logo">MicroTex ERP Solutions</div>
            {/* {!isLogged && <Login OnLogged={loggedInHandler} />} */}
            {/* {isLogged && <AdminDashboard />} */}
            <AdminDashboard />
            {/* {isLogged && isType === "user" && <UserDashboard />}
      {isLogged && isType === "proprietor" && <ProprietorDashboard />} */}
            <div className="navbar">
                <a href="#home" className="active">
                    support@microtex.in
                </a>
                <a>Contact: 1800 5654 7868</a>
                <a href="#news">Date</a>
                <a href="#contact">Time</a>
            </div>
        </div>
    );
}

export default App;
