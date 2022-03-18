import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Usersubmenu2 from "./Usersubmenu2";

const SidebarLink = styled(NavLink)`
    display: flex;
    justify-content: space-between;
    align-items: center;

    list-style: none;
    height: 50px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
    background-color: #480ca8;
    border-radius: 15px;
    &:hover {
        cursor: pointer;
        filter: brightness(125%);
    }
`;

const SidebarLabel = styled.span`
    margin-left: 16px;
`;

const UserSubmenu = ({ item }) => {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);

    return (
        <div style={{ marginBottom: "10px" }}>
            <SidebarLink
                to={item.path}
                onClick={item.subNav && showSubnav}
                style={{
                    backgroundColor: subnav ? "#5A0FD2" : "#480ca8",
                    borderRadius: subnav ? "15px 15px 0px 0px" : "15px",
                }}
                activeStyle={{ backgroundColor: "#5A0FD2" }}
            >
                <div>
                    {item.icon}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </div>
                <div style={{ marginRight: "10px" }}>
                    {item.subNav && subnav
                        ? item.iconOpened
                        : item.subNav
                        ? item.iconClosed
                        : null}
                </div>
            </SidebarLink>
            {subnav &&
                item.subNav.map((item, index) => {
                    return <Usersubmenu2 item={item} />;
                })}
        </div>
    );
};

export default UserSubmenu;
