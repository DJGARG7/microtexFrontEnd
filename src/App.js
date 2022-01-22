import "./style.css";
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
    const [isLogged, setIsLogged] = useState(false);
    const [isType, setIsType] = useState();
    // const [isUser,setIsUser] = useState();
    const [isUser,setIsUser] = useState({u_id: "userId", name: "UserName",c_id:"corpId"});

    const loggedInHandler = (status, type, corpId, userId,UserName) => {
		if(status === false){
			//show appropriate message of login failed try again in red @dhairya like in php
			console.log("inside");
			return
		}
		console.log("outside");
        setIsLogged(status);
        setIsType(type);
        setIsUser({u_id: userId, name: UserName,c_id:corpId})
    };
    return (
        <div>
            <div className="logo">MicroTex ERP Solutions</div>
            {/* {!isLogged && <Login OnLogged={loggedInHandler} />} */}
            {/* {isLogged && <AdminDashboard userDetails={isUser}/>} */}
            {/* <Login /> */}
            <AdminDashboard userDetails={isUser} />
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
