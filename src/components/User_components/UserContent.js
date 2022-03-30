import { Route } from "react-router-dom";
import Greypurchase from "../../pages/UserPages/Greypurchase";
import SendJobForWork from "../../pages/UserPages/SendJobForWork";
import Revenue from "../../pages/UserPages/Revenue";
import SaleChallan from "../../pages/UserPages/SaleChallan";
const UserContent = ({ userDetails }) => {
    return (
        <>
            <Route path="/dashboard/transaction/purchase/greypurchase" exact>
                <h1>Grey Purchase</h1>
                <Greypurchase />
            </Route>
            <Route path="/dashboard/transaction/jobforwork" exact>
                <SendJobForWork />
            </Route>
            <Route path="/dashboard/transaction/revenue" exact>
                <Revenue />
            </Route>
            <Route path="/dashboard/saleChallan" exact>
                <SaleChallan />
            </Route>
            <Route path="/dashboard" exact>
                <h1>Welcome to Microtex</h1>
            </Route>
        </>
    );
};
export default UserContent;
