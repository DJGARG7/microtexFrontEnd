import { Route } from "react-router-dom";
import GreyPurchase from "../../pages/UserPages/Purchase/GreyPurchase";
import GeneralPurchases from "../../pages/UserPages/Purchase/GeneralPurchases";
import SendToMill from "../../pages/UserPages/Mill/SendToMill";
import ReceiveFromMill from "../../pages/UserPages/Mill/ReceiveFromMill";
import SendJobForWork from "../../pages/UserPages/Job/SendJobForWork";
import ReceiveFromJob from "../../pages/UserPages/Job/ReceiveFromJob";
import SaleStock from "../../pages/UserPages/sales/SaleStock";
import SaleChallan from "../../pages/UserPages/sales/SaleChallan";
import SaleBilling from "../../pages/UserPages/sales/SaleBilling";
import SaleDisplay from "../../pages/UserPages/sales/SaleDisplay";
import CashPay from "../../pages/UserPages/cashbooks/CashPay";
import CashReceive from "../../pages/UserPages/cashbooks/CashReceive";
import BalanceSheet from "../../pages/UserPages/Reports/BalanceSheet/BalanceSheet";
import GeneralReport from "../../pages/UserPages/Reports/GeneralReport/GeneralReport";
import JobReport from "../../pages/UserPages/Reports/JobReport";
import MillReport from "../../pages/UserPages/Reports/MillReport/MillReport";

const UserContent = ({ userDetails }) => {
    return (
        <>
            {/* -------------------- Purchase -------------------- */}
            <Route path="/dashboard/transaction/purchase/grey" exact>
                <GreyPurchase userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/purchase/general" exact>
                <GeneralPurchases userDetails={userDetails} />
            </Route>
            {/* --------------------   Mill   -------------------- */}
            <Route path="/dashboard/transaction/mill/send" exact>
                <SendToMill userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/mill/receive" exact>
                <ReceiveFromMill userDetails={userDetails} />
            </Route>
            {/* --------------------- Job -------------------- */}
            <Route path="/dashboard/transaction/job/send" exact>
                <SendJobForWork userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/job/receive" exact>
                <ReceiveFromJob userDetails={userDetails} />
            </Route>
            {/* --------------------   Sale   -------------------- */}
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
            {/* -------------------- Cash Book -------------------- */}
            <Route path="/dashboard/transaction/cashbook/pay" exact>
                <CashPay userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/transaction/cashbook/receive" exact>
                <CashReceive userDetails={userDetails} />
            </Route>
            {/* --------------------   Report   -------------------- */}
            <Route path="/dashboard/reports/balance-sheet" exact>
                <BalanceSheet userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/reports/general" exact>
                <GeneralReport userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/reports/job" exact>
                <JobReport userDetails={userDetails} />
            </Route>
            <Route path="/dashboard/reports/mill" exact>
                <MillReport userDetails={userDetails} />
            </Route>
            <Route path="/dashboard" exact />
        </>
    );
};

export default UserContent;
