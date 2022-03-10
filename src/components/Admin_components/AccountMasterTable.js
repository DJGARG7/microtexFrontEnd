import React from "react";
import TableComponent from "../Reuse_components/TableComponent";
import { useState } from "react";
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
        >
          Show
        </button>
      </div>
    ),
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
const tabledata = [
  {
    AccountName: "Hello",
    AccountType: "fbjfbf",
    Address1: "lfnbrwjfw",
    Address2: "jgnrwjlbwgwr",
    Address3: "ggrgrgrgr",
  },
];
function AccountMasterTable({ data }) {
  return (
    <div>
      <TableComponent TableCol={TableColData} TableData={tabledata} />
    </div>
  );
}

export default AccountMasterTable;
