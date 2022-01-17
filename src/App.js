import "./style.css";
// import Modal from "./Modal";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
var CryptoJS = require("crypto-js");
function App() {
  // var data = [
  //     { name: "Rutvay", u_id: "RUT0051" },
  //     { name: "Digvi", u_id: "DRI0058" },
  // ];
  // localStorage.setItem("savedPro", JSON.stringify(data));
  const [isLogged, setIsLogged] = useState(false);
  const [isType, setIsType] = useState();
  const [isCorpId, setIsCorpId] = useState();
  const [isUserId, setIsUserId] = useState();
  const loggedInHandler = (status, type, corpId, userId) => {
    setIsLogged(status);
    setIsType(type);
    setIsCorpId(corpId);
    setIsUserId(userId);
  };
  return (
    <div className="mainParent">
      <div className="logo">MicroTex ERP Solutions</div>
      {!isLogged && <Login OnLogged={loggedInHandler} />}
      {isLogged && isType === "admin" && <AdminDashboard />}
      {/* {isLogged && isType === "user" && <UserDashboard />}
      {isLogged && isType === "proprietor" && <ProprietorDashboard />} */}

      <div className="navbar">
        <a href="#home" class="active">
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
