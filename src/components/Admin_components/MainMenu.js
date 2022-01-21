import { Link } from "react-router-dom";

import "../../styles/AdminDashboard.css";
import { SideBarData } from "./SideBarData";
function MainMenu(props) {
    return (
        <div className="Sidebar">
            <nav>
                <ul className="MenuBarList">
                    {SideBarData.map((val, key) => {
                        return (
                            <li key={key} className="row">
                                <Link to={val.link}>{val.title}</Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <ul className="user-details">
                <li className="row">{props.userDetails.id}</li>
                <li className="row">{props.userDetails.name}</li>
            </ul>
        </div>
    );
}

export default MainMenu;
