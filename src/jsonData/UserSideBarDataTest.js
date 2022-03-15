import React from "react";
import * as RiIcons from "react-icons/ri";

export const UserSideBarDataTest = [
  {
    title: "Transaction",
    path: "/dashboard",
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Sale",
        path: "/dashboard/transaction/sale",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subNav:[
          {
            title : "Normal sales",
            path : "/dashboard/transaction/sale/normalsale",
          }
        ]
      },
      {
        title: "Send Job for work",
        path: "/dashboard/transaction/jobforwork",
  
      },
      {
        title: "Revenue",
        path: "/dashboard/transaction/revenue",
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
  {
    title: "xyz",
    path: "/xyz",
  },
];
