import "./style.css";
// import Modal from "./Modal";
import { useEffect, useState } from "react";
var CryptoJS = require("crypto-js");
function App() {
    const [savedList, setSavedList] = useState(
        JSON.parse(localStorage.getItem("saved"))
    );
    const [corpId, setCorpId] = useState();
    const [userId, setUserId] = useState();
    var data = [
        { c_id: "KSM0001", name: "Dhananjay", u_id: "DJG0065" },
        { c_id: "SUF0001", name: "Dhairya", u_id: "DIR0007" },
    ];
    localStorage.setItem("saved", JSON.stringify(data));
    const savedClickHandler = (c_id, u_id) => {
        console.log(c_id, u_id);
        setCorpId(c_id);
        setUserId(u_id);
    };
    console.log(savedList);
    return (
        <div className="mainParent">
            <div className="logo">
                <h1>MicroTex ERP Solutions</h1>
            </div>
            <div className="blackbox">
                <div className="leftPart">
                    <h2>Saved Users</h2>
                    <div className="recentUserList">
                        {Object.keys(savedList).map((ele) => {
                            return (
                                <button
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
                    </div>
                </div>
                <div className="rightPart">
                    <h2>Login</h2>
                    <div>
                        <form>
                            <input
                                type="text"
                                name="cid"
                                value={corpId}
                                placeholder="Corporate ID"
                            />
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
                                type="submit"
                                className="btn-login"
                                value="LOGIN"
                            />
                        </form>
                    </div>
                </div>
            </div>

            {/* <div className="spacer">
        <div className="title">Welcome</div>
      </div>
      <div className="form">
        <form method="POST" action="/login/login.php" >
          <div className="form-group text-field">
            <input type="text" name="username" value="" class="" placeholder="Username"/><br/>
            <div className="display-none"><p class='alert'></p></div>
          </div>    
          <div className="form-group text-field">
            <input type="password" name="password" value="" class="" placeholder="Password"/><br/>
            <div className="display-none"><p class='alert'></p></div>
          </div>
          <div className="form-group">
            <div className="radio">
                    <label className="radio-label"><input type="radio" name="role" value="student" class=""/> STUDENT</label>
                    <label className="radio-label"><input type="radio" name="role" value="faculty" class=""/> FACULTY</label>
                    <label className="radio-label"><input type="radio" name="role" value="admin" class=""/> ADMIN</label><br/><br/>
                </div>
                <div className="display-none"><p class='alert'></p></div>
            </div>
                        <div className="btn">
                <input type="submit" className="btn-login" value="LOGIN"/>
            </div>
        </form>
    </div> */}
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
