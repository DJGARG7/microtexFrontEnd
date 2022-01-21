import { Route } from "react-router-dom";
import CityMaster from "../../pages/CityMaster";
import AccountMaster from "../../pages/AccountMaster";
import MainMenu from "./MainMenu";
import "../../styles/AdminDashboard.css";

//routes will be defined here
const AdminDashboard = (props) => {
    console.log("hello");
    return (
        <div className="body">
            <MainMenu userDetails={props.userDetails} />
            <div className="content">
                <Route path="/cityMaster">
                    <CityMaster />
                </Route>
                <Route path="/accountMaster">
                    <AccountMaster />
                </Route>
            </div>
        </div>
    );
};

export default AdminDashboard;
