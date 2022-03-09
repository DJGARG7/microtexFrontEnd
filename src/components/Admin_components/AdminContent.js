import { Route } from "react-router-dom";
import CityMaster from "../../pages/CityMaster";
import AccountMaster from "../../pages/AccountMaster";
import AdminLandingPage from "../../pages/AdminLandingPage";
import DesignMaster from "../../pages/DesignMaster";
const AdminContent = ({ userDetails }) => {
    return (
        <>
            <Route path="/dashboard/cityMaster" exact>
                <CityMaster userDetails = {userDetails} />
            </Route>
            <Route path="/dashboard/accountMaster" exact>
                <AccountMaster userDetails={userDetails}/>
            </Route>
            <Route path="/dashboard/designMaster" exact>
                <DesignMaster userDetails={userDetails}/>
            </Route>
            <Route path="/dashboard" exact>
                <AdminLandingPage />
            </Route>
        </>
    );
};
export default AdminContent;
