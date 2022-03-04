import React from "react";
import * as RiIcons from "react-icons/ri";

export const UserSideBarDataTest = [
  {
    title: "Transaction",
    path: "/transaction",
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Send Job for work",
        path: "/transaction/jobforwork",
      },
      {
        title: "Revenue",
        path: "/overview/revenue",
      },
    ],
  },
  {
    title: "Reports",
    path: "/reports",
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Reports",
        path: "/reports/reports1",

        cName: "sub-nav",
      },
      {
        title: "Reports 2",
        path: "/reports/reports2",

        cName: "sub-nav",
      },
      {
        title: "Reports 3",
        path: "/reports/reports3",
      },
    ],
  },
  {
    title: "Reports",
    path: "/reports",
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Reports",
        path: "/reports/reports1",

        cName: "sub-nav",
      },
      {
        title: "Reports 2",
        path: "/reports/reports2",

        cName: "sub-nav",
      },
      {
        title: "Reports 3",
        path: "/reports/reports3",
      },
    ],
  },
];
