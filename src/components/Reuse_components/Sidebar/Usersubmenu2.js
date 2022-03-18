import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
const SidebarLink = styled(NavLink)`
    background: #414757;
    height: 50px;
    padding-left: 3rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #f5f5f5;
    font-size: 18px;
    &:hover {
        background: #632ce4;
        cursor: pointer;
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
    background: #414757;
    height: 60px;
    padding-left: 4rem;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #f5f5f5;
    font-size: 18px;
    &:hover {
        background: #632ce4;
        cursor: pointer;
    }
`;
function Usersubmenu2({ item }) {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => setSubnav(!subnav);

    return (
        <>
            <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
                <div>
                    {item.icon}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </div>
                <div>
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
                        <div>
                            <DropdownLink to={item.path} key={index}>
                                <div>
                                    {item.icon}
                                    <SidebarLabel>{item.title}</SidebarLabel>
                                </div>
                            </DropdownLink>
                        </div>
                    );
                })}
        </>
    );
}

export default Usersubmenu2;
