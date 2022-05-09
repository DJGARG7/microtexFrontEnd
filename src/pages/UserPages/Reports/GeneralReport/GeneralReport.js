import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import styles from "../../../../styles/Report.module.css";
import Axios from "axios";
import DoughnutChart from "../../../../components/Reuse_components/charts/DoughnutChart";
// import {
//   toastError,
//   toastSuccess,
// } from "../../../components/Reuse_components/toast";

// axios default configuration to include cookie and user ID with every request.
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

// const accounts = Axios.create({
//     baseURL: "http://localhost:3003/accountMaster",
// });
const reports = Axios.create({
    baseURL: "http://localhost:3005/reports/",
});
function GeneralReport() {
    const [expense, getExpense] = useState("");
    const [itemlist, setItemList] = useState([]);
    const [itemmts, setitemmts] = useState([]);
    const getExpenditure = async () => {
        try {
            const res = await reports.get("/getExpense");
            getExpense(res.data);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };
    const expensesList = [
        expense.grey_purchase_expense,
        expense.mill_expenditure,
        expense.job_send_expenses,
        expense.general_purchase_expense,
    ];
    const expenseLabels = ["Grey_Purchase", "Mill", "Job", "General_Purchase"];
    const getItemsSold = async () => {
        try {
            const res = await reports.get("/getTotalItemSold");
            res.data.forEach((item, index) => {
                setItemList((pre) => {
                    return [...pre, item.itemName];
                });
                setitemmts((pre) => {
                    return [...pre, item.total_meters];
                });
            });
        } catch (e) {
            console.log(e);
        }
    };


    const getAccountWiseExpense = async()=>{
        try{
          const res = await reports.get("/getTotalAccountExpense");
          console.log(res);

        }catch(e){
          console.log(e);
        }
    }

    useEffect(() => {
        getExpenditure();
        getItemsSold();
        getAccountWiseExpense();
    }, []);
    console.log(itemlist);
    return (
        <div className={styles["main"]}>
            <div className={styles["chart-row"]}>
                <div className={styles["charts"]}>
                    <DoughnutChart labels={expenseLabels} data={expensesList} />
                    <br />
                    <label>Total Expenditure</label>
                </div>
                <div className={styles["charts"]}>
                    <DoughnutChart labels={itemlist} data={itemmts} />
                    <br />
                    <label>Items Bought(Mts)</label>
                </div>
                <div className={styles["charts"]}>
                    <DoughnutChart labels={itemlist} data={itemmts} />
                    <br />
                    <label>Creditors Accounts</label>
                </div>
            </div>
            <div className={styles["chart-row"]}>
                <div className={styles["charts"]}>
                    <DoughnutChart labels={itemlist} data={itemmts} />
                    <br />
                    <label>Items Bought(Mts)</label>
                </div>
                <div className={styles["charts"]}>
                    <DoughnutChart labels={itemlist} data={itemmts} />
                    <br />
                    <label>Items Bought(Mts)</label>
                </div>
                <div className={styles["charts"]}>
                    <DoughnutChart labels={itemlist} data={itemmts} />
                    <br />
                    <label>Items Bought(Mts)</label>
                </div>
            </div>
        </div>
    );
}

export default GeneralReport;
