import EntityBlock from "./EntityBlock";
import styles from "../../Mill/styles/Mill.module.css";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import axios from "axios";
import { useEffect, useState } from "react";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

const dummyData = {
    liabilites: [
        {
            heading: "Capital Account",
            subdata: [
                { name: "prop1", value: 500 },
                { name: "prop2", value: 500 },
            ],
        },
        {
            heading: "Sundry Creditors",
            subdata: [
                { name: "buyer1", value: 100 },
                { name: "buyer2", value: 100 },
                { name: "buyer2", value: 100 },
            ],
        },
        {
            heading: "Sundry Creditors",
            subdata: [
                { name: "buyer1", value: 100 },
                { name: "buyer2", value: 100 },
                { name: "buyer2", value: 100 },
            ],
        },
        {
            heading: "Sundry Creditors",
            subdata: [
                { name: "buyer1", value: 100 },
                { name: "buyer2", value: 100 },
                { name: "buyer2", value: 100 },
            ],
        },
    ],
    assets: [
        {
            heading: "cash account",
            subdata: [{ name: "cash A/c", value: 500 }],
        },
        {
            heading: "Sundry Debtors",
            subdata: [
                { name: "seller1", value: 400 },
                { name: "seller2", value: 200 },
                { name: "seller2", value: 200 },
            ],
        },
        {
            heading: "Sundry Debtors",
            subdata: [
                { name: "seller1", value: 400 },
                { name: "seller2", value: 200 },
                { name: "seller2", value: 200 },
            ],
        },
        {
            heading: "Sundry Debtors",
            subdata: [
                { name: "seller1", value: 400 },
                { name: "seller2", value: 200 },
                { name: "seller2", value: 200 },
            ],
        },
        {
            heading: "Sundry Debtors",
            subdata: [
                { name: "seller1", value: 400 },
                { name: "seller2", value: 200 },
                { name: "seller2", value: 200 },
            ],
        },
    ],
};

export default function BalanceSheet({ userDetails }) {
    // Authorization state.
    const [isAllowed, setIsAllowed] = useState(false);

    // Loading states.
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isBSLoading, setIsBSLoading] = useState(true);

    // Data.
    const [BSData, setBSData] = useState({});

    let assetSum = 0;
    let liabilitySum = 0;

    let setAssetSum = (n) => {
        console.log(assetSum, "exec");
        assetSum += n;
    };
    let setLiabilitySum = (n) => {
        console.log(liabilitySum, "exec");
        liabilitySum += n;
    };

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/13`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(
                "http://localhost:3005/reports/balancesheet"
            );
            setBSData(res.data);
            setIsBSLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load balance sheet data.", toastStyle);
        }
    };

    useEffect(() => {
        checkPermission();
        fetchData();
    }, []);

    if (isAllowedLoading || isBSLoading) {
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

    if (!isAllowed) {
        return (
            <div
                style={{
                    marginTop: "10vh",
                }}
            >
                <strong>You are not allowed access to this area.</strong>
            </div>
        );
    }

    return (
        <div className={styles["main"]}>
            <h2>Balance Sheet</h2>
            <div className={styles["grid--container"]}>
                <div className={styles["grid--column"]}>
                    {BSData.liabilites?.map((liability, index) => {
                        console.log(liabilitySum);
                        return (
                            <EntityBlock
                                key={index}
                                data={liability}
                                setSum={setLiabilitySum}
                            />
                        );
                    })}
                </div>
                <div className={styles["grid--column"]}>
                    {BSData.assets?.map((assets, index) => {
                        console.log(assetSum);
                        return (
                            <EntityBlock
                                key={index}
                                data={assets}
                                setSum={setAssetSum}
                            />
                        );
                    })}
                </div>
            </div>
            <div
                className={styles["form--group"]}
                style={{
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#edf2f4",
                    marginTop: "auto",
                    marginBottom: "0",
                    position: "sticky",
                    bottom: "0",
                }}
            >
                <div
                    className={styles["form--group"]}
                    style={{
                        width: "100%",
                        height: "50px",
                        marginBottom: "0",
                        backgroundColor: "#dddddd",
                        borderRadius: "7.5px",
                        alignItems: "center",
                        textTransform: "uppercase",
                        fontWeight: "700",
                        fontSize: "1.4rem",
                    }}
                >
                    <div style={{ marginLeft: "1vw" }}>Total</div>
                    <div style={{ marginRight: "100px" }}>{liabilitySum}</div>
                    <div style={{ marginRight: "1vw" }}>{assetSum}</div>
                </div>
            </div>
        </div>
    );
}
