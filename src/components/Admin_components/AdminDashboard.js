import { Route } from "react-router-dom";
import CityMaster from "../../pages/CityMaster";
import { useState } from "react";
import AccountMaster from "../../pages/AccountMaster";
import MainMenu from "./MainMenu";
import "../../styles/AdminDashboard.css";
import SideBar from "./SideBar";

//routes will be defined here
const AdminDashboard = (props) => {
  const [ChangeDisplay, setOption] = useState("Menu Bar");

  const currentPath = window.location.pathname
  return (
    <div className="body">
      <div className="MainMenu" >
        <MainMenu userDetails={props.userDetails} />
      </div>
      <div className="content">
        <Route path="/cityMaster">
          <CityMaster userDetails={props.userDetails} />
        </Route>
        <Route path="/accountMaster">
          <AccountMaster />
        </Route>
      </div>
    </div>
  );
};

export default AdminDashboard;
