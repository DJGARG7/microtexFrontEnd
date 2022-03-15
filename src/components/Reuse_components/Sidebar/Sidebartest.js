import styled from "styled-components";
import styles from "./Sidebar.module.css";
import UserSubmenu from "./UserSubmenu";
import { IconContext } from "react-icons/lib";

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 17.5vw;
  height: 100%;
  overflow : auto;
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
          <div className={styles["sidebar--user"]}>
            <li
              className={`${styles["sidebar--user-detail"]} ${styles["sidebar--user-name"]}`}
            >
              {userDetails.userName}
            </li>
            <li
              className={`${styles["sidebar--user-detail"]} ${styles["sidebar--user-id"]}`}
            >
              {userDetails.corporateID !== ""
                ? `${userDetails.corporateID} // ${userDetails.userID}`
                : `${userDetails.userID}`}
            </li>

            <button
              className={styles["sidebar--logout-btn"]}
              onClick={logoutHandler}
            >
              Logout
            </button>
          </div>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebartest;
