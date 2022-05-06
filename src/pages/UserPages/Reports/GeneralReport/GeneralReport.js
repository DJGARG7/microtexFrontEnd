import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import styles from "../../../../styles/Report.module.css";
import Axios from "axios";
// import {
//   toastError,
//   toastSuccess,
// } from "../../../components/Reuse_components/toast";

// axios default configuration to include cookie and user ID with every request.
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

const accounts = Axios.create({
    baseURL: "http://localhost:3003/accountMaster",
});
const reports = Axios.create({
    baseURL: "http://localhost:3005/reports/",
});
function GeneralReport() {
    const [expense, getExpense] = useState(""); 

    const getExpenditure = async () => {
        try {
            const res = await reports("/getExpense");
            getExpense(res.data);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };



    useEffect(() => {
        getExpenditure();
    }, [ ]);
    const data = {
        labels: ["Grey_Purchase", "Mill", "Job", "General_Purchase"],
        datasets: [
            {
                label: "My First Dataset",
                data: [
                    expense.grey_purchase_expense,
                    expense.mill_expenditure,
                    expense.job_send_expenses,
                    0
                ],
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                    "rgb(0, 255, 0)",
                ],
                hoverOffset: 4,
            },
        ],
    };
    return (
        <div className={styles["main"]}>
            <div className={styles["chart-row"]}>
                <div className={styles["charts"]}>
                    <Doughnut data={data} />
                    <br />
                    <label>Total Expenditure</label>
                </div>
                <div className={styles["charts"]}>
                    <Doughnut data={data} />
                </div>
                <div className={styles["charts"]}>
                    <Doughnut data={data} />
                </div>
            </div>
            <div className={styles["chart-row"]}>
                <div className={styles["charts"]}>
                    <Doughnut data={data} />
                </div>
                <div className={styles["charts"]}>
                    <Doughnut data={data} />
                </div>
                <div className={styles["charts"]}>
                    <Doughnut data={data} />
                </div>
            </div>
        </div>
    );
}

export default GeneralReport;
