import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import UserSubmenu from "./UserSubmenu";
import * as RiIcons from "react-icons/ri";

const UserManagementData = {
    title: "User Management",
    path: "/dashboard/user-management",
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
        // {
        //     title: "Change admin password",
        //     path: "/dashboard/user-management/change-admin-password",
        // },
        {
            title: "Add new user",
            path: "/dashboard/user-management/add-user",
        },
        {
            title: "Delete User",
            path: "/dashboard/user-management/delete-user",
        },
        {
            title: "Manage permissions",
            path: "/dashboard/user-management/manage-permissions",
        },
    ],
};

function Sidebar({ SideBarData, userDetails, logoutHandler }) {
    return (
        <div className={styles["sidebar"]}>
            <div className={styles["sidebar--nav-links"]}>
                {SideBarData.data.map((val, key) => {
                    return (
                        <NavLink
                            className={styles["sidebar--nav-link"]}
                            activeClassName={styles["sidebar--active-nav-link"]}
                            to={val.link}
                            key={key}
                        >
                            <li>{val.title}</li>
                        </NavLink>
                    );
                })}
                <UserSubmenu item={UserManagementData} />
            </div>
            <div className={styles["sidebar--user"]}>
                <li
                    className={`${styles["sidebar--user-detail"]} ${styles["sidebar--user-name"]}`}
                >
                    {userDetails.userName}
                </li>
                <li
                    className={`${styles["sidebar--user-detail"]} ${styles["sidebar--user-id"]}`}
                >
                    {userDetails.corporateID !== ""
                        ? `${userDetails.corporateID} // ${userDetails.userID}`
                        : `${userDetails.userID}`}
                </li>

                <button
                    className={styles["sidebar--logout-btn"]}
                    onClick={logoutHandler}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
export default Sidebar;
