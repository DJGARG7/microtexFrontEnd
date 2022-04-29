import EntityBlock from "./EntityBlock";
import styles from "../../Mill/styles/Mill.module.css";
import { flexRender } from "react-table/dist/react-table.development";

const dummyData = {
    liabilites: [
        {
            heading: "Capital Account",
            total: 1000,
            subdata: [
                { name: "prop1", value: 500 },
                { name: "prop2", value: 500 },
            ],
        },
        {
            heading: "Sundry Creditors",
            total: 300,
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
            total: 1000,
            subdata: [{ name: "cash A/c", value: 500 }],
        },
        {
            heading: "Sundry Creditors",
            total: 800,
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
            <div
                className={styles["grid--container"]}
                // style={{ backgroundColor: "red", padding: "15px" }}
            >
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
        </div>
    );
}
