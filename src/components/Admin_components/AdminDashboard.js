import AdminContent from "./AdminContent";
import { Fragment } from "react/cjs/react.production.min";
import "../../styles/AdminDashboard.css";
import { Toaster } from "react-hot-toast";
import AdminSideBarData from "../../jsonData/AdminSideBarData";
import SideBar from "../Reuse_components/Sidebar/Sidebar";

const AdminDashboard = ({ userDetails, logoutHandler }) => {
    return (
        <Fragment>
            <Toaster />
            <div className="body">
                <SideBar
                    SideBarData={{ data: AdminSideBarData }}
                    userDetails={userDetails}
                    logoutHandler={logoutHandler}
                />
                <div className="content">
                    <AdminContent userDetails={userDetails} />
                </div>
            </div>
        </Fragment>
    );
};
export default AdminDashboard;
