import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import StickyTable from "../Reuse_components/StickyTable"

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
                            // showclick(tabledata[tableProps.row.index]); 
                        }}
                    >
                        Show
                    </button>
                </div>
            ),
           sticky : "left",
        },
        {
            Header: "Unique Id",
            accessor: "uid",
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
        },
        {
            Header: "Address 2",
            accessor: "address2",
        },
        {
            Header: "Address 3",
            accessor: "address3",
        },
        {
            Header: "City",
            accessor: "city",
        },
        {
            Header: "Pincode",
            accessor: "pincode",
        },
        {
            Header: "Phone No",
            accessor: "phoneNo",
        },
        {
            Header: "Email",
            accessor: "email",
        },
        {
            Header: "GSTIN",
            accessor: "GSTIN",
        },
        {
            Header: "RegDate",
            accessor: "RegDate",
        },
        {
            Header: "propName",
            accessor: "propName",
        },
        {
            Header: "PAN",
            accessor: "PAN",
        },
        {
            Header: "dist",
            accessor: "dist",
        },
        {
            Header: "Transport",
            accessor: "transport",
        },
        {
            Header: "OpeningBal",
            accessor: "openingBal",
        },
        {
            Header: "Cr/Dr",
            accessor: "Cr/Dr",
        },
        {
            Header: "BeneName",
            accessor: "beneName",
        },
        {
            Header: "Account Number",
            accessor: "AccountNum",
        },
        {
            Header: "IFSC",
            accessor: "IFSC",
        },
        {
            Header: "Shares",
            accessor: "shares",
        },
    ];
    
    useEffect(() => {
        (async function fetchdata() {
            try {
                const res = await Axios.get(
                    "http://localhost:3003/accountMaster/FetchAll"
                );
                console.log(res);
                settabledata(res.data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    return ( <StickyTable TableCol={TableColData} TableData={tabledata} />
    );
}

export default AccountMasterTable;
