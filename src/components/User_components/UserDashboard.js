import React from "react";
import { UserSideBarDataTest } from "../../jsonData/UserSideBarDataTest";
import Sidebartest from "../Reuse_components/Sidebartest";
import { Fragment } from "react/cjs/react.production.min";
import UserContent from "./UserContent";
function UserDashboard({ userDetails, logoutHandler }) {
  return (
    <Fragment>
      {/* <Prompt when={displayPrompt} message = "Dont use browser back/forward buttons"/> */}
      <div className="body">
        <div className="MainMenu">
          {/* <SideBar userDetails={userDetails} logoutHandler={logoutHandler} SideBarData={{ data: UserSideBarData }}/> */}
          <Sidebartest SidebarDataUserTest={UserSideBarDataTest} userDetails={userDetails} logoutHandler={logoutHandler}/>
        </div>
        <div className="content">
            <UserContent/>
        </div>
      </div>
    </Fragment>
  );
}

export default UserDashboard;
