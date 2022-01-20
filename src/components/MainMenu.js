import "./AdminDashboard.css";
import { SideBarData } from "./SideBarData";

function MainMenu(props) {
  return (
    <div className="Sidebar">
      <ul className="MenuBarList">
        {SideBarData.map((val, key) => {
          return (
            <li key={key} onClick={()=>{window.location.pathname=val.link}} className="row">
                {" "}
              <div>{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MainMenu;
