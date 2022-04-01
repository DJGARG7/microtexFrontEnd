import React from "react";
import * as RiIcons from "react-icons/ri";

export const UserSideBarDataTest = [
    {
        title: "Transaction",
        path: "/dashboard/transaction",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: "Purchase",
                path: "/dashboard/transaction/purchase",
                iconClosed: <RiIcons.RiArrowDownSFill />,
                iconOpened: <RiIcons.RiArrowUpSFill />,
                subNav: [
                    {
                        title: "Grey purchase",
                        path: "/dashboard/transaction/purchase/grey",
                    },
                    {
                        title: "General purchase",
                        path: "/dashboard/transaction/purchase/general",
                    },
                ],
            },
            {
                title: "MILL",
                path: "/dashboard/transaction/mill",
                iconClosed: <RiIcons.RiArrowDownSFill />,
                iconOpened: <RiIcons.RiArrowUpSFill />,
                subNav: [
                    {
                        title: "Send to Mill",
                        path: "/dashboard/transaction/mill/send",
                    },
                    {
                        title: "Receive from Mill",
                        path: "/dashboard/transaction/mill/receive",
                    },
                ],
            },
            {
                title: "JOB",
                path: "/dashboard/transaction/job",
                iconClosed: <RiIcons.RiArrowDownSFill />,
                iconOpened: <RiIcons.RiArrowUpSFill />,
                subNav: [
                    {
                        title: "Send",
                        path: "/dashboard/transaction/job/send",
                    },
                    {
                        title: "Receive",
                        path: "/dashboard/transaction/job/receive",
                    },
                ],
            },
            {
                title: "Sale",
                path: "/dashboard/transaction/sale",
                iconClosed: <RiIcons.RiArrowDownSFill />,
                iconOpened: <RiIcons.RiArrowUpSFill />,
                subNav: [
                    {
                        title: "Sale Challan",
                        path: "/dashboard/saleChallan",
                    },
                    {
                        title: "Sale Billing",
                        path: "/dashboard/saleBilling",
                    },
                    {
                        title: "Display Bills",
                        path: "/dashboard/displayBills",
                    },
                ],
            },
        ],
    },
    {
        title: "Reports",
        path: "/dashboard",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: "Reports 1",
                path: "/dashboard/reports1",

                cName: "sub-nav",
            },
            {
                title: "Reports 2",
                path: "/dashboard/reports2",

                cName: "sub-nav",
            },
            {
                title: "Reports 3",
                path: "/dashboard/reports3",
            },
        ],
    },
    {
        title: "xyz",
        path: "/xyz",
    },
];