import { Route } from "react-router-dom";
import CityMasterAdd from "../../pages/CityMasterAdd";
import AccountMaster from "../../pages/AccountMaster";
import AdminLandingPage from "../../pages/AdminLandingPage";
const AdminContent = () => {
    return (
        <div>
            <Route path="/cityMaster/add">
                <CityMasterAdd />
            </Route>
            {/* <Route path="/cityMaster/view">
                <CityMasterView/>
            </Route>
            <Route path="/cityMaster/delete">
                <CityMasterDelete/>
            </Route> */}
            <Route path="/accountMaster">
                <AccountMaster />
            </Route>
            <Route path="/" exact><AdminLandingPage/></Route>
            
        </div>
    );
};
export default AdminContent;
