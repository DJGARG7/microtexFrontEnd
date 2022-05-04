import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import StickyTable from "../Reuse_components//Table/StickyTable";
import toast from "react-hot-toast";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

function AccountMasterTable({ showclick }) {
    const [tabledata, settabledata] = useState([]);

    const TableColData = [
        {
            Header: "Action",
            accessor: (str) => "delete",
            Cell: (tableProps) => (
                <div>
                    <button
                        style={{
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            showclick(tabledata[tableProps.row.index]);
                        }}
                    >
                        Show
                    </button>
                </div>
            ),
            sticky: "left",
            Filter: "",
        },
        {
            Header: "Unique Id",
            accessor: "uid",
            show: false,
        },
        {
            Header: "Account Name",
            accessor: "AccName",
        },
        {
            Header: "Account Type",
            accessor: "AccType",
        },
        {
            Header: "Address 1",
            accessor: "address1",
            Filter: "",
        },
        {
            Header: "Address 2",
            accessor: "address2",
            Filter: "",
        },
        {
            Header: "Address 3",
            accessor: "address3",
            Filter: "",
        },
        {
            Header: "City",
            accessor: "city",
        },
        {
            Header: "Pincode",
            accessor: "pincode",
            Filter: "",
        },
        {
            Header: "Phone No.",
            accessor: "phoneNo",
            Filter: "",
        },
        {
            Header: "Email",
            accessor: "email",
            Filter: "",
        },
        {
            Header: "GSTIN",
            accessor: "GSTIN",
            Filter: "",
        },
        {
            Header: "Reg. Date",
            accessor: "RegDate",
            Filter: "",
        },
        {
            Header: "prop. Name",
            accessor: "propName",
            Filter: "",
        },
        {
            Header: "PAN",
            accessor: "PAN",
            Filter: "",
        },
        {
            Header: "dist",
            accessor: "dist",
            Filter: "",
        },
        {
            Header: "Transport",
            accessor: "transport",
            Filter: "",
        },
        {
            Header: "Opening Bal.",
            accessor: "openingBal",
            Filter: "",
        },
        {
            Header: "Cr/Dr",
            Filter: "",
            accessor: "CrDr",
        },
        {
            Header: "Ben. Name",
            accessor: "beneName",
            Filter: "",
        },
        {
            Header: "Account No.",
            accessor: "AccountNum",
            Filter: "",
        },
        {
            Header: "IFSC",
            accessor: "IFSC",
            Filter: "",
        },
        {
            Header: "Shares",
            accessor: "shares",
            Filter: "",
        },
    ];

    useEffect(() => {
        (async function fetchdata() {
            // const FToast = toast.loading("Fetching accounts...", toastStyle);

            try {
                const res = Axios.get("http://localhost:3003/accountMaster");

                toast.promise(
                    res,
                    {
                        loading: "Fetching accounts...",
                        success: (data) => {
                            console.log(data);
                            data.data.forEach((item, index) => {
                                const date = new Date(item.RegDate);
                                item.RegDate = date.toLocaleDateString("en-GB");
                            });
                            settabledata(data.data);
                            return "Accounts fetched!";
                        },
                        error: "Failed to fetch account data.",
                    },
                    toastStyle
                );
            } catch (e) {
                console.log(e);
                // toast.error("Failed to fetch accounts.", toastStyle, {
                //     id: FToast,
                // });
            }
        })();
    }, []);

    return (
        <StickyTable
            TableCol={TableColData}
            TableData={tabledata}
            style={{ width: "80vw", maxHeight: "75vh" }}
        />
    );
}

export default AccountMasterTable;
