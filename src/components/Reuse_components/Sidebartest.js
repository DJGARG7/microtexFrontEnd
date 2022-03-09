import styled from "styled-components";

// import { SidebarDataUserTest } from "../../jsonData/SideBarUserTest";
import UserSubmenu from "./UserSubmenu";
import { IconContext } from "react-icons/lib";

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 17.5vw;
  height: 100%;

  background-color: #480ca8;
  border-radius: 15px;
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
          </SidebarWrap>
            <ul className="user-details">
              <li className="row">{userDetails.userName}</li>
              <li className="row">{userDetails.userID}</li>
              <li className="row">{userDetails.corporateID}</li>
            </ul>
          <button
            type="submit"
            className="sidebartest--logoutbutton"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebartest;
