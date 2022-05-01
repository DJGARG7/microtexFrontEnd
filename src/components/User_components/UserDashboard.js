import React from "react";
import { UserSideBarDataTest } from "../../jsonData/userData/UserSideBarDataTest";
import Sidebartest from "../Reuse_components/Sidebar/Sidebartest";
import { Fragment } from "react/cjs/react.production.min";
import UserContent from "./UserContent";
import { Toaster } from "react-hot-toast";
import "../../styles/AdminDashboard.css";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

function UserDashboard({ userDetails, logoutHandler }) {
    return (
        <Fragment>
            <Toaster
                toastOptions={{
                    // Define default options
                    className: "",
                    style: { toastStyle },
                    // Default options for specific types
                    loading: {
                        duration: 30000,
                    },
                }}
            />
            <div className="body">
                <Sidebartest
                    SidebarDataUserTest={UserSideBarDataTest}
                    userDetails={userDetails}
                    logoutHandler={logoutHandler}
                />
                <div className="content">
                    <UserContent userDetails={userDetails} />
                </div>
            </div>
        </Fragment>
    );
}
export default UserDashboard;
