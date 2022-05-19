import React, { useEffect, useState } from "react";
import "chart.js/auto";
import styles from "../../../../styles/Report.module.css";
import styles2 from "../../Mill/styles/Mill.module.css";
import Axios from "axios";
import DoughnutChart from "../../../../components/Reuse_components/charts/DoughnutChart";
import BarChart from "../../../../components/Reuse_components/charts/BarChart";
import ReactLoading from "react-loading";

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
    const [expenditure, setexpenditure] = useState(0);
    const [income, setincome] = useState(0);
    const [accountCreditors, setAccountCreditors] = useState({
        labels: [],
        data: [],
    });

    const [itemSold, setItemSold] = useState({
        labels: [],
        data: [],
    });

    const [salesAccountWise, setSalesAccountWise] = useState({
        labels: [],
        data: [],
    });

    const [isLoading1, setIsLoading1] = useState(true);
    const [isLoading2, setIsLoading2] = useState(true);
    const [isLoading3, setIsLoading3] = useState(true);
    const [isLoading4, setIsLoading4] = useState(true);
    const [isLoading5, setIsLoading5] = useState(true);

    // expense track for every process
    const getExpenditure = async () => {
        try {
            const res = await reports.get("/getExpense");
            getExpense(res.data);
            setIsLoading1(false);
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
            setIsLoading2(false);
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
                data: res.data.map((item) => item.total),
            });
            let totalexp = 0;

            res.data.forEach((item) => {
                totalexp += parseInt(item.total);
            });
            console.log("total exp", totalexp);
            setexpenditure(totalexp);
            setIsLoading3(false);
        } catch (e) {
            console.log(e);
        }
    };

    // fetching data about all the items sold
    const getItemSold = async () => {
        try {
            const res = await reports.get("/getItemSold");
            setItemSold({
                labels: res.data.map((item) => item.Type),
                data: res.data.map((item) => item.total_pcs),
            });
            setIsLoading4(false);
        } catch (e) {
            console.log(e);
        }
    };

    // for getting total sales account wise
    const getTotalSaleAccountWise = async () => {
        try {
            const res = await reports.get("/getTotalSaleAccountWise");
            console.log(res.data);
            setSalesAccountWise({
                labels: res.data.map((item) => item.CNAME),
                data: res.data.map((item) => item.amount),
            });
            let totalinc = 0;
            res.data.forEach((item) => {
                totalinc += parseInt(item.amount);
            });
            setincome(totalinc);
            setIsLoading5(false);
            console.log("total inc", totalinc);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getExpenditure();
        getItemsSold();
        getAccountWiseExpense();
        getItemSold();
        getTotalSaleAccountWise();
    }, []);

    if (isLoading1 || isLoading2 || isLoading3 || isLoading4 || isLoading5) {
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
        <div className={styles2["main"]}>
            <h2>General Report</h2>
            <div className={styles2["form"]}>
                <div className={styles["chart-row"]}>
                    <div className={styles["charts"]}>
                        <DoughnutChart
                            labels={expenseLabels}
                            data={expensesList}
                        />
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
                    <div className={styles["charts"]}>
                        <DoughnutChart
                            labels={["Income", "Expense"]}
                            data={[income, expenditure]}
                        />
                        <br />
                        <label>Expense Vs Income</label>
                    </div>
                </div>
                <div className={styles["chart-row"]}>
                    <div
                        className={styles["charts"]}
                        style={{ width: "700px" }}
                    >
                        <BarChart chartData={accountCreditors} />
                        <br />
                        <label>
                            Accounts to whom we have given business to(INR)
                        </label>
                    </div>
                </div>
                <div className={styles["chart-row"]}>
                    <div
                        className={styles["charts"]}
                        style={{ width: "700px" }}
                    >
                        <BarChart chartData={salesAccountWise} />
                        <br />
                        <label>
                            Accounts who has given business to us(INR)
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GeneralReport;
