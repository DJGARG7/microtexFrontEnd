import { Route } from "react-router-dom";
import CityMasterAdd from "../../pages/CityMasterAdd";
import AccountMaster from "../../pages/AccountMaster";
import AdminLandingPage from "../../pages/AdminLandingPage";
const AdminContent = () => {
    return (
        <div>
            <Route path="/cityMaster" exact>
                <CityMasterAdd/>
            </Route>
            <Route path="/accountMaster" exact>
                <AccountMaster />
            </Route>
            {/* <Route path="/accountTypeMaster" exact>
                <AccountTypeMaster/>
            </Route> */}
            <Route path="/" exact><AdminLandingPage/></Route>
        </div>
    );
};
export default AdminContent;
