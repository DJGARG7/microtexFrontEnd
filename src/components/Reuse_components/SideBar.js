import { NavLink } from "react-router-dom";

function SideBar({ SideBarData, userDetails, logoutHandler }) {
    return (
        <div className="sidebar">
            <div className="sidebar--nav-links">
                {SideBarData.data.map((val, key) => {
                    return (
                        <NavLink
                            className="sidebar--nav-link"
                            activeClassName="sidebar--active-nav-link"
                            to={val.link}
                            key={key}
                        >
                            <li>{val.title}</li>
                        </NavLink>
                    );
                })}
            </div>
            <ul className="sidebar--user">
                <li className="sidebar--user-detail sidebar--user-name">
                    {userDetails.userName}
                </li>
                <li className="sidebar--user-detail sidebar--user-id">
                    {userDetails.corporateID !== ""
                        ? `${userDetails.corporateID} // ${userDetails.userID}`
                        : `${userDetails.userID}`}
                </li>

                <button className="sidebar--logout-btn" onClick={logoutHandler}>
                    Logout
                </button>
            </ul>
        </div>
    );
}
export default SideBar;
