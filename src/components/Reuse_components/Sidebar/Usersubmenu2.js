import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

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
    background-color: #5a0fd2;
    border-radius: 0px;
    &:hover {
        cursor: pointer;
        filter: brightness(125%);
    }
    &:last-child {
        border-radius: 0px 0px 15px 15px;
    }
`;

const SidebarLabel = styled.span`
    margin-left: 0px;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
`;

const DropdownLink = styled(NavLink)`
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
    background-color: #7113ff;
    border-radius: 0px;
    &:hover {
        cursor: pointer;
        filter: brightness(125%);
    }
`;
function Usersubmenu2({ item }) {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <SidebarLink
                to={item.path}
                onClick={item.subNav && showSubnav}
                style={{ backgroundColor: subnav ? "#7113FF" : "#5A0FD2" }}
                activeStyle={{ backgroundColor: "#7113FF" }}
            >
                <div>
                    {item.icon}
                    <SidebarLabel style={{ marginLeft: "25px" }}>
                        {item.title}
                    </SidebarLabel>
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
                    return (
                        <div key={index}>
                            <DropdownLink
                                to={item.path}
                                key={index}
                                activeStyle={{ backgroundColor: "#8D18FF" }}
                            >
                                <div>
                                    {item.icon}
                                    <SidebarLabel
                                        style={{ marginLeft: "37.5px" }}
                                    >
                                        {`- ${item.title}`}
                                    </SidebarLabel>
                                </div>
                            </DropdownLink>
                        </div>
                    );
                })}
        </>
    );
}

export default Usersubmenu2;
