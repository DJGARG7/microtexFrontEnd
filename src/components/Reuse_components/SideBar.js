import { NavLink } from "react-router-dom";

function SideBar({ SideBarData, userDetails, logoutHandler }) {
    return (
        <>
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
                <li className="row">{userDetails.userName}</li>
                <li className="row">{userDetails.userID}</li>
                <li className="row">{userDetails.corporateID}</li>
                <button className="logout-btn" onClick={logoutHandler}>
                    Logout
                </button>
            </ul>
        </>
    );
}
export default SideBar;
