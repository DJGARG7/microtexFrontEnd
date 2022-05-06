import React from "react";
import * as RiIcons from "react-icons/ri";

export const UserSideBarDataTest = [
    {
        title: "Transactions",
        path: "#",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: "Purchase",
                path: "#",
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
                path: "#",
                iconClosed: <RiIcons.RiArrowDownSFill />,
                iconOpened: <RiIcons.RiArrowUpSFill />,
                subNav: [
                    {
                        title: "Send",
                        path: "/dashboard/transaction/mill/send",
                    },
                    {
                        title: "Receive",
                        path: "/dashboard/transaction/mill/receive",
                    },
                ],
            },
            {
                title: "JOB",
                path: "#",
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
                path: "#",
                iconClosed: <RiIcons.RiArrowDownSFill />,
                iconOpened: <RiIcons.RiArrowUpSFill />,
                subNav: [
                    {
                        title: "Add Stock for sale",
                        path: "/dashboard/saleStock",
                    },
                    {
                        title: "Challan",
                        path: "/dashboard/saleChallan",
                    },
                    {
                        title: "Billing",
                        path: "/dashboard/saleBilling",
                    },
                    {
                        title: "Bills",
                        path: "/dashboard/displayBills",
                    },
                ],
            },
            {
                title: "Cash Book",
                path: "#",
                iconClosed: <RiIcons.RiArrowDownSFill />,
                iconOpened: <RiIcons.RiArrowUpSFill />,
                subNav: [
                    {
                        title: "Payment",
                        path: "/dashboard/transaction/cashbook/pay",
                    },
                    {
                        title: "Receive",
                        path: "/dashboard/transaction/cashbook/receive",
                    },
                ],
            },
        ],
    },
    {
        title: "Reports",
        path: "#",
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: "Balance Sheet",
                path: "/dashboard/reports/balance-sheet",

                cName: "sub-nav",
            },
            {
                title: "General Report",
                path: "/dashboard/reports/general",
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
