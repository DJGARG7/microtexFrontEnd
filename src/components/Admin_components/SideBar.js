import { NavLink } from "react-router-dom";
import "../../styles/SideBar.css";
function SideBar({ SideBarData, userDetails, onClickMenu, onBack }) {
    const clickHandler = (valTitle, valSubLinks) => {
        onClickMenu(valTitle, valSubLinks);
    };
    const backHandler = () => {
        onBack();
    };
    return (
        <div className="Sidebar">
            {!SideBarData.status && (
                <ul className="MenuBarList">
                    {SideBarData.data.map((val, key) => {
                        return (
                            <li
                                key={key}
                                className="row"
                                onClick={() =>
                                    clickHandler(val.title, val.sublinks)
                                }
                            >
                                {val.title}
                            </li>
                        );
                    })}
                </ul>
            )}
            {SideBarData.status && (
                <div>
                    <center>{SideBarData.name}</center>
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
                    <button onClick={backHandler}>Back</button>
                </div>
            )}

            <ul className="user-details">
                <li className="row">{userDetails.name}</li>
                <li className="row">{userDetails.u_id}</li>
                <li className="row">{userDetails.c_id}</li>
            </ul>
        </div>
    );
}

export default SideBar;
