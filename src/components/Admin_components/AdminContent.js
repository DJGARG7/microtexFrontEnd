import { Route } from "react-router-dom";
import CityMaster from "../../pages/AdminPages/CityMaster";
import AccountMaster from "../../pages/AdminPages/AccountMaster";
import AdminLandingPage from "../../pages/AdminPages/AdminLandingPage";
import DesignMaster from "../../pages/AdminPages/DesignMaster";
import UserManagementIndex from "../UserManagement/UserManagementIndex";
import AddUser from "../UserManagement/AddUser";
import ManagePermissions from "../UserManagement/ManagePermissions";
import DeleteUser from "../UserManagement/DeleteUser";
import ChangeAdminPassword from "../UserManagement/ChangeAdminPassword";
import AccessLog from "../../pages/AdminPages/AccessLog";
const AdminContent = ({ userDetails }) => {
    return (
        <>
            <Route path="/dashboard/cityMaster" exact>
                <CityMaster userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/accountMaster" exact>
                <AccountMaster userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/designMaster" exact>
                <DesignMaster userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/user-management" exact>
                <UserManagementIndex />
            </Route>
            <Route path="/dashboard/accesslogs" exact>
                <AccessLog />
            </Route>
            {/* <Route
                path="/dashboard/user-management/change-admin-password"
                exact
            >
                <ChangeAdminPassword userDetails={userDetails} />
            </Route> */}
            <Route path="/dashboard/user-management/add-user" exact>
                <AddUser userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/user-management/delete-user" exact>
                <DeleteUser userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/user-management/manage-permissions" exact>
                <ManagePermissions userDetails={userDetails} />
            </Route>
            <Route path="/dashboard" exact>
                <AdminLandingPage />
            </Route>
        </>
    );
};
export default AdminContent;
