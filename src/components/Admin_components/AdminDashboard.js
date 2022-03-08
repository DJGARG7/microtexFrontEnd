import MainMenu from "./MainMenu";
import AdminContent from "./AdminContent";
import { Fragment } from "react/cjs/react.production.min";
import "../../styles/AdminDashboard.css";
import { Toaster } from "react-hot-toast";

const AdminDashboard = ({ userDetails, logoutHandler }) => {
    return (
        <Fragment>
            <Toaster />
            <div className="body">
                <div className="MainMenu">
                    <MainMenu
                        userDetails={userDetails}
                        logoutHandler={logoutHandler}
                    />
                </div>
                <div className="content">
                    <AdminContent userDetails={userDetails} />
                </div>
            </div>
        </Fragment>
    );
};
export default AdminDashboard;
