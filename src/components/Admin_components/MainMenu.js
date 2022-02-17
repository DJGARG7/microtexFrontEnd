import SideBar from "../Reuse_components/SideBar";
import AdminSideBarData from "../../jsonData/AdminSideBarData";
// import { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import "../../styles/AdminDashboard.css";

function MainMenu({ userDetails, logoutHandler }) {
    // const history = useHistory();
    // const [subMenu, setSubMenu] = useState({
    //     data: AdminSideBarData,
    // });

    // const onClickMenu = (name, subData) => {
    //     console.log(name, subData);
    //     setSubMenu({ status: true, data: subData, name: name });
    // };
    // const onBack = () => {
    //     setSubMenu({ status: false, data: AdminSideBarData, name: "" });
    //     // history.goBack();
    //     history.push("/");
    // };
    return (
        <SideBar
            SideBarData={{ data: AdminSideBarData }}
            userDetails={userDetails}
            logoutHandler={logoutHandler}
            // onClickMenu={onClickMenu}
            // onBack={onBack}
        />
    );
}
export default MainMenu;
