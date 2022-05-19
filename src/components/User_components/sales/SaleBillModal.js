import StickyTable from "../../Reuse_components/Table/StickyTable";
import styles from "../../../pages/UserPages/Mill/styles/Mill.module.css";

const SaleBillModal = ({ billData, makeBill }) => {
    const colHead = billData.colHead;
    return (
        <div>
            <div
                className={styles["form--group"]}
                style={{ flexDirection: "column" }}
            >
                <p>
                    <strong>Challan Number:</strong> {billData.info.BILL_NO}
                </p>
                <p>
                    <strong>Customer:</strong> {billData.info.CNAME}
                </p>
                <p>
                    <strong>Challan Date:</strong> {billData.info.ORDER_DATE}
                </p>
            </div>

            <div className={styles["form--table"]}>
                <StickyTable TableCol={colHead} TableData={billData.detail} />
            </div>

            <p>
                <strong>Total Amount: </strong>
                {billData.total}
            </p>
            <button
                type="button"
                onClick={makeBill}
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                style={{ width: "100px", margin: "20px 0 0 0" }}
            >
                Make Bill
            </button>
        </div>
    );
};
export default SaleBillModal;
