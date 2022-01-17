import "./style.css";
// import Modal from "./Modal";
import { useEffect, useState } from "react";
import Login from "./components/Login";
var CryptoJS = require("crypto-js");
function App() {
  var data = [{ name: 'Rutvay',u_id:'RUT0051' }, { name: 'Digvi',u_id:'DRI0058' }]
  localStorage.setItem("savedPro",JSON.stringify(data))
  return (
    <div className="mainParent">
    <div className="logo">MicroTex ERP Solutions</div>
    {isLogged? (<Login/>):(<adminDashboard/>)}
     <div className="navbar">
        <a href="#home" class="active">support@microtex.in</a>
        <a>Contact: 1800 5654 7868</a>
        <a href="#news">Date</a>
        <a href="#contact">Time</a>
      </div>
    </div>
  );
}

export default App;
