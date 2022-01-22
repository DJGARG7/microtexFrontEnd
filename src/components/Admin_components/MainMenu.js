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
							<Link to={val.link}>
                            <li key={key} className="row">
                                {val.title}
                            </li></Link>
                        );
                    })}
                </ul>
            </nav>
            <ul className="user-details">
                <li className="row">{props.userDetails.name}</li>
                <li className="row">{props.userDetails.u_id}</li>
                <li className="row">{props.userDetails.c_id}</li>
            </ul>
        </div>
    );
}

export default MainMenu;
