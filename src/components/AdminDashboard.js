import { Route } from "react-router-dom";
import CityMaster from "../pages/CityMaster";
import MainMenu from "./MainMenu";
import "./AdminDashboard.css";
//routes will be defined here
const AdminDashboard = () => {
  console.log("hello");
  return (
    <div className="body">
      <MainMenu />
      <div className="content">
        <Route path="/cityMaster">
          <CityMaster />
        </Route>
      </div>
    </div>
  );
};

export default AdminDashboard;
