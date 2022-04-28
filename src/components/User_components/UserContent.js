import { Route } from "react-router-dom";
import Greypurchase from "../../pages/UserPages/GreyPurchase";
import GeneralPurchases from "../../pages/UserPages/GeneralPurchases";
import SendToMill from "../../pages/UserPages/Mill/SendToMill";
import ReceiveFromMill from "../../pages/UserPages/Mill/ReceiveFromMill";
import SendJobForWork from "../../pages/UserPages/SendJobForWork";
import ReceiveFromJob from "../../pages/UserPages/ReceiveFromJob";
import SaleStock from "../../pages/UserPages/sales/SaleStock";
import SaleChallan from "../../pages/UserPages/sales/SaleChallan";
import SaleBilling from "../../pages/UserPages/sales/SaleBilling";
import SaleDisplay from "../../pages/UserPages/sales/SaleDisplay";
import CashPay from "../../pages/UserPages/cashbooks/CashPay";
import CashRecieve from "../../pages/UserPages/cashbooks/CashRecieve";
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
            <Route path="/dashboard/saleStock" exact>
                <SaleStock userDetails={userDetails} />
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
            <Route path="/dashboard/transaction/cashbook/pay" exact>
                <CashPay userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/cashbook/recieve" exact>
                <CashRecieve userDetails={userDetails} />
            </Route>
            <Route path="/dashboard" exact>
                <h2>Welcome to Microtex</h2>
            </Route>
        </>
    );
};
export default UserContent;
