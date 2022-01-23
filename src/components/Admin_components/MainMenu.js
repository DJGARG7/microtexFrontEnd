import { useState } from "react";
import {useHistory} from "react-router-dom"
import SideBar from "./SideBar";
import AdminSideBarData from "../../jsonData/AdminSideBarData";

import "../../styles/AdminDashboard.css";

function MainMenu({ userDetails }) {
    const history = useHistory();
    const [subMenu, setSubMenu] = useState({
        status: false,
        data: AdminSideBarData,
        name: "",
    });

    const onClickMenu = (name, subData) => {
        console.log(name, subData);
        setSubMenu({ status: true, data: subData, name: name });
    };
    const onBack = () => {
        setSubMenu({ status: false, data: AdminSideBarData, name: "" });
        // history.goBack();
        history.push("/");
    };
    return (
        <SideBar
            SideBarData={subMenu}
            userDetails={userDetails}
            onClickMenu={onClickMenu}
            onBack={onBack}
        />
    );
}

export default MainMenu;
