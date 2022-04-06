import { Toaster } from "react-hot-toast";
import AdminContent from "./AdminContent";
import AdminSideBarData from "../../jsonData/adminData/AdminSideBarData";
import SideBar from "../Reuse_components/Sidebar/Sidebar";
import "../../styles/AdminDashboard.css";

const AdminDashboard = ({ userDetails, logoutHandler }) => {
    return (
        <>
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
        </>
    );
};
export default AdminDashboard;
