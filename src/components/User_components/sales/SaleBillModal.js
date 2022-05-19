import StickyTable from "../../Reuse_components/Table/StickyTable";
import styles from "../../../pages/UserPages/Mill/styles/Mill.module.css";
import Modal from "../../Reuse_components/Modal";
import { useState } from "react";
import SaleBillPdf from "./SaleBillPdf";
const SaleBillModal = ({ billData, makeBill }) => {
    const colHead = billData.colHead;
    const [isOpenPdf, setIsOpenPdf] = useState(false);
    const [toggle, setToggle] = useState(false);
    const makeBillHandler = () => {
        var ans = makeBill();
        setToggle(ans);
    };
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
                onClick={makeBillHandler}
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                style={{ width: "100px", margin: "20px 0 0 0" }}
                disabled={toggle}
            >
                Make Bill
            </button>
            <button
                type="button"
                onClick={() => setIsOpenPdf(true)}
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                style={{ width: "100px", margin: "20px 0 0 0" }}
                disabled={!toggle}
            >
                Invoice
            </button>
            <Modal
                open={isOpenPdf}
                onClose={() => {
                    setIsOpenPdf(false);
                }}
            >
                <SaleBillPdf data={billData} />
            </Modal>
        </div>
    );
};
export default SaleBillModal;
