import { Route } from "react-router-dom";
import CityMaster from "../../pages/CityMaster";
import AccountMaster from "../../pages/AccountMaster";
import AdminLandingPage from "../../pages/AdminLandingPage";
import DesignMaster from "../../pages/DesignMaster";
// import UserManagementIndex from "../UserManagement/UserManagementIndex";
// import AddUser from "../UserManagement/AddUser";
// import ManagePermissions from "../UserManagement/ManagePermissions";
// import DeleteUser from "../UserManagement/DeleteUser";
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
            {/* <Route path="/dashboard/user-management" exact>
                <UserManagementIndex />
            </Route>
            <Route path="/dashboard/user-management/add-user" exact>
                <AddUser />
            </Route>
            <Route path="/dashboard/user-management/delete-user" exact>
                <DeleteUser />
            </Route>
            <Route path="/dashboard/user-management/manage-permissions" exact>
                <ManagePermissions />
            </Route> */}
            <Route path="/dashboard" exact>
                <AdminLandingPage />
            </Route>
        </>
    );
};
export default AdminContent;
