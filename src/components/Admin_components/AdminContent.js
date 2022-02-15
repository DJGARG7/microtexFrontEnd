import { Route } from "react-router-dom";
import CityMaster from "../../pages/CityMaster";
import AccountMaster from "../../pages/AccountMaster";
import AdminLandingPage from "../../pages/AdminLandingPage";
const AdminContent = () => {
    return (
        <div>
            <Route path="/cityMaster" exact>
                <CityMaster/>
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
