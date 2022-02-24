import { Route } from "react-router-dom";
import CityMaster from "../../pages/CityMaster";
import AccountMaster from "../../pages/AccountMaster";
import AdminLandingPage from "../../pages/AdminLandingPage";
const AdminContent = ({ firm }) => {
    return (
        <>
            <Route path="/cityMaster" exact>
                <CityMaster c_id={firm} />
            </Route>
            <Route path="/accountMaster" exact>
                <AccountMaster />
            </Route>
            {/* <Route path="/accountTypeMaster" exact>
                <AccountTypeMaster/>
            </Route> */}
            <Route path="/" exact>
                <AdminLandingPage />
            </Route>
        </>
    );
};
export default AdminContent;
