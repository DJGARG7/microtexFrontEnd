import { useState } from "react";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import styles from "../../../components/UserManagement/styles/common.module.css";

export default function BillsTable({ data, setIsTakaModalOpen }) {
    const TableColData = [
        {
            Header: "Bill Number",
            accessor: "billNumber",
        },
        {
            Header: "Bill Date",
            accessor: "billDate",
        },
        {
            Header: "Account Name",
            accessor: "AccName",
        },
        {
            Header: "Item Name",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Taka",
            accessor: "taka",
            Filter: "",
        },
        {
            Header: "Meters",
            accessor: "meters",
            Filter: "",
        },
        {
            Header: "Action",
            accessor: (str) => "edit",
            Cell: (tableProps) => (
                <div>
                    <button
                        className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                        style={{
                            cursor: "pointer",
                            height: "auto",
                            padding: "2.5px 7.5px",
                            margin: "0",
                            fontSize: "0.9rem",
                            textTransform: "uppercase",
                            fontWeight: "600",
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsTakaModalOpen(true);
                        }}
                    >
                        Choose Taka
                    </button>
                </div>
            ),
            sticky: "left",
            Filter: "",
            width: 100,
        },
    ];

    return <StickyTable TableCol={TableColData} TableData={data} />;
}
