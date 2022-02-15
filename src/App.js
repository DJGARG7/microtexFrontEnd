import "./style.css";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/Admin_components/AdminDashboard";
import TableComponent from "./components/Admin_components/AdminDashboard";
import AccountTypeData from "./jsonData/AccountTypeData";
function App() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        setInterval(() => {
            setTime(new Date());
        }, 1000);
    }, []);
    localStorage.getItem("savedPro") === null &&
        localStorage.setItem("savedPro", JSON.stringify({}));
    localStorage.getItem("savedFirm") === null &&
        localStorage.setItem("savedFirm", JSON.stringify({}));
    // var exp = {
    //     "RUT0051":{ name: "Rutvay", u_id: "RUT0051" },
    //     "DRI0058":{ name: "Digvi", u_id: "DRI0058" },
    // };
    // localStorage.setItem("savedPro", JSON.stringify(exp));
    const [isLogged, setIsLogged] = useState("false");
    const [isType, setIsType] = useState();
    const [isUser, setIsUser] = useState({
        u_id: "userId",
        name: "UserName",
        c_id: "corpId",
    });
    const loggedInHandler = (status, type, corpId, userId, UserName) => {
        if (status === "fail") {
            //show appropriate message of login failed try again in red @dhairya like in php
            setIsLogged("fail");
            console.log("inside");
            return;
        }
        console.log("outside");
        setIsLogged(status);
        setIsType(type);
        setIsUser({ u_id: userId, name: UserName, c_id: corpId });
    };
    return (
        <div>
            <div className="logo">MicroTex ERP Solutions</div>
            {/* {isLogged === "fail" && (
                <div className="logo">Login Failed Try Again</div>
            )} */}
            {/* {!isLogged && <Login OnLogged={loggedInHandler} />}
            {/* <Login /> */}
            {/* {isLogged && <AdminDashboard userDetails={isUser}/>} */}
            {/* <Login /> */}
            {/* <AdminDashboard userDetails={isUser} /> */}
            {/* {isLogged && isType === "user" && <UserDashboard />}
            {isLogged && isType === "proprietor" && <ProprietorDashboard />} */}
            <div className="navbar">
                <a className="active">support@microtex.in</a>
                <a>Contact: 1800 5654 7868</a>
                <a>{time.toLocaleDateString()}</a>
                <a>{time.toLocaleTimeString()}</a>
            </div>
        </div>
    );
}

export default App;
