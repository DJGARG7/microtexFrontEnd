import SideBar from "../Reuse_components/SideBar";
import AdminSideBarData from "../../jsonData/AdminSideBarData";
// import { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import "../../styles/AdminDashboard.css";
import { UserSideBarDataTest } from "../../jsonData/UserSideBarDataTest";

function MainMenu({ userDetails, logoutHandler }) {
    return (
        <UserSideBarDataTest
            SideBarData={{ data: AdminSideBarData }}
            userDetails={userDetails}
            logoutHandler={logoutHandler}
        />
    );
}
export default MainMenu;
