import "./style.css";
// import Modal from "./Modal";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/Admin_components/AdminDashboard";

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
    };

    //backend name
    let user = { id: "12345", name: "DummyName" };
    console.log(user);

    return (
        <div>
            <div className="logo">MicroTex ERP Solutions</div>
            {/* {!isLogged && <Login OnLogged={loggedInHandler} />} */}
            {/* {isLogged && <AdminDashboard />} */}
            <Login />
            {/* <AdminDashboard userDetails={user} /> */}
            {/* {isLogged && isType === "user" && <UserDashboard />}
      {isLogged && isType === "proprietor" && <ProprietorDashboard />} */}
            <div className="navbar">
                <a className="active">support@microtex.in</a>
                <a href="#hello">Contact: 1800 5654 7868</a>
                <a href="#hello">Date</a>
                <a href="#hello">Time</a>
            </div>
        </div>
    );
}

export default App;
