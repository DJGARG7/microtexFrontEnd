
import {useState } from 'react';
import "../../styles/AdminDashboard.css";
import SideBar from "./SideBar";
import SideBarData from "./SideBarData";
import CityMasterData from "../../pages/CityMasterData";
function MainMenu(props) {
    const [option, setOption] = useState(SideBarData);
    
    const onClickMenu = (name)=>{
        console.log(name);
        if(name==="City Master")
        {setOption(CityMasterData)}
        else if(name === "Account Master")
            setOption(CityMasterData);
    }
    return (
            <SideBar SideBarData={option}  userDetails={props.userDetails} onClickMenu={onClickMenu}/>
    );
}

export default MainMenu;