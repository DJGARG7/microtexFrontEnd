import { Link } from "react-router-dom";

import "../../styles/AdminDashboard.css";
import { SideBarData } from "./SideBarData";
function MainMenu(props) {
  return (
      <nav className="Sidebar">
        <ul className="MenuBarList">
          {SideBarData.map((val, key) => {
            return (
              <li key={key} className="row">
                <Link to={val.link}>{val.title}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
  );
}

export default MainMenu;
