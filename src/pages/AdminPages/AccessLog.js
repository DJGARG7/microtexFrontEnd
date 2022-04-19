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
            accessor: "user_date",
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
            res.data.forEach((item, index) => {
                const date = new Date(item.user_date);
                item.user_date = date.toLocaleDateString();
            });
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
