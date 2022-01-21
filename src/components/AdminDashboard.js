import MainMenu from "./MainMenu";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    console.log("hello");
    return (
        <div className="body">
            <MainMenu />
            <div className="content">Hello</div>
        </div>
    );
};

export default AdminDashboard;
