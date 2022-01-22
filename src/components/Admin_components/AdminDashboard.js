import { Route } from "react-router-dom";
import MainMenu from "./MainMenu";
import AdminContent from "./AdminContent";

import "../../styles/AdminDashboard.css";

const AdminDashboard = ({ userDetails }) => {
    return (
        // <Route path="/" exact>
        <div className="body">
            <div className="MainMenu">
                <MainMenu userDetails={userDetails} />
            </div>
            <div className="content">
                <AdminContent />
            </div>
        </div>
        // </Route>
    );
};

export default AdminDashboard;
