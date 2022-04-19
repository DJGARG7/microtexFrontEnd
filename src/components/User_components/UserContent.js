import { Route } from "react-router-dom";
import Greypurchase from "../../pages/UserPages/GreyPurchase";
import ReceiveFromMill from "../../pages/UserPages/Mill/ReceiveFromMill";
import SendToMill from "../../pages/UserPages/Mill/SendToMill";
import SendJobForWork from "../../pages/UserPages/SendJobForWork";
import Revenue from "../../pages/UserPages/Revenue";
import SaleChallan from "../../pages/UserPages/SaleChallan";
import SaleBilling from "../../pages/UserPages/SaleBilling";
import SaleDisplay from "../../pages/UserPages/SaleDisplay";
import GeneralPurchases from "../../pages/UserPages/GeneralPurchases";
import ReceiveFromJob from "../../pages/UserPages/ReceiveFromJob";
const UserContent = ({ userDetails }) => {
    return (
        <>
            <Route path="/dashboard/transaction/purchase/grey" exact>
                <Greypurchase userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/purchase/general" exact>
                <GeneralPurchases userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/" exact>
                <h1>Transaction</h1>
            </Route>
            <Route path="/dashboard/transaction/mill" exact />
            <Route path="/dashboard/transaction/mill/send" exact>
                <SendToMill userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/mill/receive" exact>
                <ReceiveFromMill userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/job/send" exact>
                <SendJobForWork userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/job/receive" exact>
                <ReceiveFromJob userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/revenue" exact>
                <Revenue userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/saleChallan" exact>
                <SaleChallan userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/saleBilling" exact>
                <SaleBilling userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/displayBills" exact>
                <SaleDisplay userDetails={userDetails} />
            </Route>
            <Route path="/dashboard" exact>
                <h2>Welcome to Microtex</h2>
            </Route>
        </>
    );
};
export default UserContent;
