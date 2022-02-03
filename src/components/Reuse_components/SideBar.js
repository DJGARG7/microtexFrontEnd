import { NavLink } from "react-router-dom";
import "../../styles/SideBar.css";

function SideBar({ SideBarData, userDetails }) {
    return (
        <div className="Sidebar">
            <ul className="MenuBarList">
                {SideBarData.data.map((val, key) => {
                    return (
                        <NavLink activeClassName="SBactive" to={val.link}>
                            <li key={key} className="row">
                                {val.title}
                            </li>
                        </NavLink>
                    );
                })}
            </ul>
            <ul className="user-details">
                <li className="row">{userDetails.name}</li>
                <li className="row">{userDetails.u_id}</li>
                <li className="row">{userDetails.c_id}</li>
            </ul>
        </div>
    );
}
export default SideBar;