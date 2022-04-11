import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import StickyTable from "../Reuse_components//Table/StickyTable";

const DesignMasterTable = ({showclick}) => {
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
                            console.log(tabledata[tableProps.row.index]);
                            showclick(tabledata[tableProps.row.index]);
                            // console.log(tableProps);
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
            Header: "Design No.",
            accessor: "Dno",
        },
        {
            Header: "Design Name",
            accessor: "NAME",
        },
        {
            Header: "Cloth Type",
            accessor: "CLOTH_TYPE",
        },
        {
            Header: "Basic Cost",
            accessor: "BASIC_COST",
            Filter: "",
        },
        {
            Header: "Work Cost",
            accessor: "WORK_COST",
            Filter: "",
        },
        {
            Header: "lace Cost",
            accessor: "LACE_COST",
            Filter: "",
        },
        {
            Header: "Diamond Cost",
            accessor: "DIAMOND_COST",
            Filter: "",
        },
        {
            Header: "packing cost",
            accessor: "PACKING_COST",
            Filter: "",
        },
        {
            Header: "MU",
            accessor: "MU",
            Filter: "",
        },
        {
            Header: "Price after MU",
            accessor: "CALC_PRICE",
            Filter: "",
        },
        {
            Header: "Work job",
            accessor: "WORK_JOB",
            Filter: "",
        },
        {
            Header: "Lace Job",
            accessor: "LACE_JOB",
            Filter: "",
        },
        {
            Header: "Diamond Job",
            accessor: "DIAM_JOB",
            Filter: "",
        },
    ];
    useEffect(async () => {
        try {
            const res = await Axios.get("http://localhost:3004/designMaster");
            console.log(res);
            settabledata(res.data);
        } catch (e) {
            console.log(e);
        }
    }, []);
    return <StickyTable TableCol={TableColData} TableData={tabledata}  style={{width:"1000px",height:"500px"}} />;
};
export default DesignMasterTable;
