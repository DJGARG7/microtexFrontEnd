import { Link } from "react-router-dom";
import "../../styles/SideBar.css";
function SideBar(props) {
  const ClickedOption = (event) =>{
      props.onClickMenu(event);
  }
  return (
    <div className="Sidebar">
      <nav>
        <ul className="MenuBarList">
          {props.SideBarData.map((val, key) => {
            return (
              <Link to={val.link}>
                <li key={key} className="row" onClick={ClickedOption.bind(this, val.title)}>
                  {val.title}
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>
      <ul className="user-details">
        <li className="row">{props.userDetails.name}</li>
        <li className="row">{props.userDetails.u_id}</li>
        <li className="row">{props.userDetails.c_id}</li>
      </ul>
    </div>
  );
}

export default SideBar;
