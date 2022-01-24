import MainMenu from "./MainMenu";
import AdminContent from "./AdminContent";

import "../../styles/AdminDashboard.css";

const AdminDashboard = ({ userDetails }) => {
    return (
        <div className="body">
            <div className="MainMenu">
                <MainMenu userDetails={userDetails} />
            </div>
            <div className="content">
                <AdminContent />
            </div>
        </div>
    );
};

export default AdminDashboard;
