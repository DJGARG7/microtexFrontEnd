import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../../styles/Accesslogs.css";
import styles from "../../pages/UserPages/Mill/styles/Mill.module.css";
import TableComponent from "./../../components/Reuse_components/Table/TableComponent";
Axios.defaults.withCredentials = true;
const usrinstance = Axios.create({
    baseURL: "http://localhost:3005/accesslogs",
});
function AccessLog() {
    const tablecoldata = [
        {
            Header: "User Name",
            accessor: "userName",
            Filter: "",
        },
        {
            Header: "Corporate Id ",
            accessor: "corporateID",
            Filter: "",
        },
        {
            Header: "User Id",
            accessor: "userID",
            Filter: "",
        },
        {
            Header: "Date",
            accessor: "Date",
            Filter: "",
        },
        {
            Header: "Time",
            accessor: "Time",
            Filter: "",
        },
    ];
    const [logs, setlogs] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await usrinstance.get(" ");
            console.log(res.data);
            res.data.forEach((item, index) => {
                const date = new Date(item.Date);
                item.Date = date.toLocaleDateString();
            });
            console.log(res.data);
            setlogs(res.data);
        })();
    }, []);
    return (
        <div className="log--main">
            <h2 className={styles["title"]}>Access Logs</h2>
            <div className="log--div">
                <TableComponent TableCol={tablecoldata} TableData={logs} />
            </div>
        </div>
    );
}

export default AccessLog;
