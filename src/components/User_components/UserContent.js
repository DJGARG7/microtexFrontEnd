import { Route } from "react-router-dom";
import Greypurchase from "./user_pages/Greypurchase";
import Revenue from "./user_pages/Revenue";
import SendJobForWork from "./user_pages/SendJobForWork";
const UserContent = ({ userDetails }) => {
    return (
        <>
         <Route path="/dashboard/transaction/purchase/greypurchase" exact>
                <Greypurchase />
            </Route>
            <Route path="/dashboard/transaction/jobforwork" exact>
                <SendJobForWork />
            </Route>
            <Route path="/dashboard/transaction/revenue" exact>
                <Revenue/>
            </Route>
            <Route path="/dashboard" exact>
                <h1>Welcome to Microtex</h1>
            </Route>
        </>
    );
};
export default UserContent;
