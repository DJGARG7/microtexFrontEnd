import { useState } from "react";
import styles from "../../../pages/UserPages/Mill/styles/Mill.module.css";

const SaleStockModal = ({ stockData, transferStock }) => {
    const [allSelected, setAllSelected] = useState(false);
    const [mtsForTransfer, setMtsForTransfer] = useState(0);
    const checkboxHandler = () => {
        setAllSelected(!allSelected);
        setMtsForTransfer(stockData);
    };

    return (
        <div>
            <h2>Add Stock</h2>
            <br />
            <p>Available: {stockData}m</p>
            <input
                type="number"
                name="mtsForTransfer"
                value={mtsForTransfer}
                onChange={(e) => setMtsForTransfer(e.target.value)}
                disabled={allSelected}
                className={styles["form--input"]}
                style={{
                    width: "10vw",
                    minWidth: "150px",
                }}
            />
            <label
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                style={{ width: "200px", padding: "8px", margin: "0 10px" }}
            >
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={checkboxHandler}
                    style={{ display: "none" }}
                />
                Add all available?
            </label>
            <button
                type="button"
                onClick={() => {
                    transferStock(mtsForTransfer);
                }}
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                style={{ width: "50px" }}
                disabled={
                    mtsForTransfer < 0 ||
                    mtsForTransfer > stockData ||
                    mtsForTransfer == ""
                }
            >
                Add
            </button>
        </div>
    );
};
export default SaleStockModal;
