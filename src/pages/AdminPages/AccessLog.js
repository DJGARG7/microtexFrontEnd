import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../../styles/Accesslogs.css";
import styles from "../../pages/UserPages/Mill/styles/Mill.module.css";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import ReactLoading from "react-loading";
import toast from "react-hot-toast";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

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
            // width: 100,
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
            accessor: "loginDate",
            Filter: "",
        },
        {
            Header: "Time",
            accessor: "loginTime",
            Filter: "",
        },
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [logs, setlogs] = useState([]);

    const fetchData = async () => {
        try {
            const res = await usrinstance.get(" ");
            res.data.forEach((item, index) => {
                const date = new Date(item.loginDate);
                item.loginDate = date.toLocaleDateString("en-GB");
            });
            setlogs(res.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch access logs.", toastStyle);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div
                style={{
                    marginTop: "10vh",
                }}
            >
                <ReactLoading type="bubbles" color="#212121" />
            </div>
        );
    }

    return (
        <div className={styles["main"]}>
            <h2>Access Logs</h2>
            <div className={styles["form--table"]}>
                <StickyTable
                    TableCol={tablecoldata}
                    TableData={logs}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "70vh",
                    }}
                />
            </div>
        </div>
    );
}

export default AccessLog;
