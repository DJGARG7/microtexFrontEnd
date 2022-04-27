import { useState } from "react";
const SaleStockModal = ({ stockData, transferStock }) => {
    const [allSelected, setAllSelected] = useState(false);
    const [mtsForTransfer, setMtsForTransfer] = useState(0);
    const checkboxHandler = () => {
        setAllSelected(!allSelected);
        setMtsForTransfer(stockData);
    };
    return (
        <>
            <p>Available meters : {stockData}</p>
            <input
                type="checkbox"
                checked={allSelected}
                onChange={checkboxHandler}
            />
            Select complete stock
            <input
                type="number"
                name="mtsForTransfer"
                value={mtsForTransfer}
                onChange={(e) => setMtsForTransfer(e.target.value)}
                disabled={allSelected}
            ></input>
            <button
                type="button"
                onClick={() => {
                    transferStock(mtsForTransfer);
                }}
                disabled={
                    mtsForTransfer < 0 ||
                    mtsForTransfer > stockData ||
                    mtsForTransfer == ""
                }
            >
                Add
            </button>
        </>
    );
};
export default SaleStockModal;
