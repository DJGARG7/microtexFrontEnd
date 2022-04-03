import React from "react";
import { UserSideBarDataTest } from "../../jsonData/userData/UserSideBarDataTest";
import Sidebartest from "../Reuse_components/Sidebar/Sidebartest";
import { Fragment } from "react/cjs/react.production.min";
import UserContent from "./UserContent";
import { Toaster } from "react-hot-toast";
import "../../styles/AdminDashboard.css";
function UserDashboard({ userDetails, logoutHandler }) {
    return (
        <Fragment>
            <Toaster />
            <div className="body">
                <div className="MainMenu">
                    <Sidebartest
                        SidebarDataUserTest={UserSideBarDataTest}
                        userDetails={userDetails}
                        logoutHandler={logoutHandler}
                    />
                </div>
                <div className="content">
                    <UserContent userDetails={userDetails} />
                </div>
            </div>
        </Fragment>
    );
}
export default UserDashboard;
