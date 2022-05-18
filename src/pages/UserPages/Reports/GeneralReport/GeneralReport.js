import React, { useEffect, useState } from "react";
import "chart.js/auto";
import styles from "../../../../styles/Report.module.css";
import Axios from "axios";
import DoughnutChart from "../../../../components/Reuse_components/charts/DoughnutChart";
import BarChart from "../../../../components/Reuse_components/charts/BarChart";

// axios default configuration to include cookie and user ID with every request.
Axios.defaults.withCredentials = true;
Axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

const reports = Axios.create({
    baseURL: "http://localhost:3005/reports/",
});
function GeneralReport() {
    const [expense, getExpense] = useState("");
    const [itemlist, setItemList] = useState([]);
    const [itemmts, setitemmts] = useState([]);
    const [accountCreditors, setAccountCreditors] = useState({
        labels: [],
        data: [],
    });
    const [itemSold, setItemSold] = useState({
        labels: [],
        data: [],
    });
    const [salesAccountWise,setSalesAccountWise] = useState({
        labels: [],
        data : [],
    })
    // expense track for every process
    const getExpenditure = async () => {
        try {
            const res = await reports.get("/getExpense");
            getExpense(res.data);
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
    // number of item sold
    const getItemsSold = async () => {
        try {
            const res = await reports.get("/getTotalItemBought");
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

    // for fetching account to which we have given business
    const getAccountWiseExpense = async () => {
        try {
            const res = await reports.get("/getTotalAccountExpense");
            setAccountCreditors({
                labels: res.data.map((item) => item.AccName),
                data : res.data.map((item) => item.total),
            });
        } catch (e) {
            console.log(e);
        }
    };

    // fetching data about all the items sold 
    const getItemSold = async () =>{
        try{
            const res = await reports.get("/getItemSold");
            setItemSold({
                labels : res.data.map((item)=>item.Type),
                data : res.data.map((item)=>item.total_pcs),
            })
        }catch(e){
            console.log(e);
        }
    }

    // for getting total sales account wise
    const getTotalSaleAccountWise = async ()=>{
        try{
            const res = await reports.get("/getTotalSaleAccountWise");
            console.log(res.data);
            setSalesAccountWise({
                labels : res.data.map((item)=>item.CNAME),
                data : res.data.map((item)=>item.amount),
            })
        }catch(e){
            console.log(e);
        }
    }

    useEffect(() => {
        getExpenditure();
        getItemsSold();
        getAccountWiseExpense();
        getItemSold();
        getTotalSaleAccountWise();
    }, []);
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
                    <DoughnutChart
                        labels={itemSold.labels}
                        data={itemSold.data}
                    />
                    <br />
                    <label>Items Sold(pcs)</label>
                </div>
            </div>
            <div className={styles["chart-row"]}>
                <div className={styles["charts"]} style={{width:"700px"}}>
                    <BarChart chartData={accountCreditors} />
                    <br />
                    <label>Accounts to whom we have given business to(INR)</label>
                </div>
            </div>
            <div className={styles["chart-row"]}>
                <div className={styles["charts"]} style={{width:"700px"}}>
                    <BarChart chartData={salesAccountWise} />
                    <br />
                    <label>Accounts who has given business to us(INR)</label>
                </div>
            </div>
        </div>
    );
}

export default GeneralReport;
