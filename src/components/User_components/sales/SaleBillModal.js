import StickyTable from "../../Reuse_components/Table/StickyTable";
const SaleBillModal = ({ billData, makeBill }) => {
    const colHead = billData.colHead;
    return (
        <>
            <p>{billData.info.BILL_NO}</p>
            <p>{billData.info.CNAME}</p>
            <p>{billData.info.ORDER_DATE}</p>
            <StickyTable
                TableCol={colHead}
                TableData={billData.detail}
            ></StickyTable>
            <p>{billData.total}</p>
            <button type="button" onClick={makeBill}>
                Make Bill
            </button>
        </>
    );
};
export default SaleBillModal;
