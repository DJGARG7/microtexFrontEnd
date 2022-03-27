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
        title : "Purchase",
        path : "/dashboard/transaction/purchase",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subNav : [
          {
            title : "Grey purchase",
            path : "/dashboard/transaction/purchase/greypurchase",
          },
          {
            title : "General purchase",
            path : "/dashboard/transaction/purchase/greypurchase",
          }
        ]
      },
      // {
      //   title: "Sale",
      //   path: "/dashboard/transaction/sale",
      //   iconClosed: <RiIcons.RiArrowDownSFill />,
      //   iconOpened: <RiIcons.RiArrowUpSFill />,
      //   subNav: [
      //     {
      //       title: "Normal sales",
      //       path: "/dashboard/transaction/sale/normalsale",
      //     },
      //   ],
      // },
      {
        title: "JOB",
        path: "/dashboard/transaction/jobforwork",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        subNav: [
          {
            title : "Send",
            path : "/dashboard/transaction/job/send"
          },
          {
            title : "Receive",
            path : "/dashboard/transaction/job/receive"
          }
        ]
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
