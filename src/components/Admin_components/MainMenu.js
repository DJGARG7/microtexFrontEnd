import SideBar from "../Reuse_components/SideBar";
import AdminSideBarData from "../../jsonData/AdminSideBarData";
// import { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import "../../styles/AdminDashboard.css";

function MainMenu({ userDetails, logoutHandler }) {
    return (
        <SideBar
            SideBarData={{ data: AdminSideBarData }}
            userDetails={userDetails}
            logoutHandler={logoutHandler}
        />
    );
}
export default MainMenu;
