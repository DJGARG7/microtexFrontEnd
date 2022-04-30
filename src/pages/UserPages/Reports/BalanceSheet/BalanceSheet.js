import EntityBlock from "./EntityBlock";
import styles from "../../Mill/styles/Mill.module.css";

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
    ],
};

export default function BalanceSheet({ userDetails }) {
    return (
        <div className={styles["main"]}>
            <h2>Balance Sheet</h2>
            <div className={styles["grid--container"]}>
                <div className={styles["grid--column"]}>
                    {dummyData.liabilites.map((liability) => {
                        return <EntityBlock data={liability} />;
                    })}
                </div>
                <div className={styles["grid--column"]}>
                    {dummyData.assets.map((liability) => {
                        return <EntityBlock data={liability} />;
                    })}
                </div>
            </div>
            <div
                className={styles["form--group"]}
                style={{
                    justifyContent: "center",
                    marginTop: "auto",
                    marginBottom: "0",
                    position: "sticky",
                    bottom: "0",
                }}
            ></div>
        </div>
    );
}
