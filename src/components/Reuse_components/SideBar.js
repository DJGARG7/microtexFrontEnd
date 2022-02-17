import { NavLink } from "react-router-dom";
import "../../styles/SideBar.css";

function SideBar({ SideBarData, userDetails, logoutHandler }) {
    return (
        <div className="Sidebar">
            <ul className="MenuBarList">
                {SideBarData.data.map((val, key) => {
                    return (
                        <NavLink
                            activeClassName="SBactive"
                            to={val.link}
                            key={key}
                        >
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
                <button className="row" onClick={logoutHandler}>
                    Logout
                </button>
            </ul>
        </div>
    );
}
export default SideBar;
