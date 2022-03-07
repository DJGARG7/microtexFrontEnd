import styled from "styled-components";


// import { SidebarDataUserTest } from "../../jsonData/SideBarUserTest";
import UserSubmenu from "./UserSubmenu";
import { IconContext } from "react-icons/lib";

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 89vh;
  display: flex;
  justify-content: center;
  position: fixed;
  margin-top:5vh;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebartest = ({ SidebarDataUserTest, userDetails, logoutHandler }) => {

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <SidebarNav sidebar={true}>
          <SidebarWrap>
            {SidebarDataUserTest.map((item, index) => {
              return <UserSubmenu item={item} key={index} />;
            })}
            <ul className="user-details">
              <li className="row">{userDetails.name}</li>
              <li className="row">{userDetails.u_id}</li>
              <li className="row">{userDetails.c_id}</li>
              <button type="submit" className="row" onClick={logoutHandler}>
                Logout
              </button>
            </ul>
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebartest;
