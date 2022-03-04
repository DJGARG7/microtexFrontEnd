import { Route } from "react-router-dom";

const UserContent = ({ userDetails }) => {
    return (
        <>
            <Route path="/cityMaster" exact>
         
            </Route>
            <Route path="/accountMaster" exact>

            </Route>
            {/* <Route path="/accountTypeMaster" exact>
                <AccountTypeMaster/>
            </Route> */}
            <Route path="/" exact>
                <h1>Welcome to Microtex</h1>
            </Route>
        </>
    );
};
export default UserContent;
