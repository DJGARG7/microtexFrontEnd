import "react-widgets/styles.css";
import "../../styles/Greypurchase.css";
import Modal from "../../components/Reuse_components/Modal";

import StickyTable from "../../components/Reuse_components/Table/StickyTable";
import TakaDetails from "../../components/Reuse_components/TakaDetails";

import { useState, useEffect } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import {
    toastError,
    toastSuccess,
} from "../../components/Reuse_components/toast";

import styles2 from "./Mill/styles/Mill.module.css";

// Axios default configuration to include cookie and user ID with every request.
axios.defaults.withCredentials = true;
axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

// Axios instances.
const accounts = axios.create({
    baseURL: "http://localhost:3003/accountMaster/",
});

const purchases = axios.create({
    baseURL: "http://localhost:3005/purchases/",
});

// Helper function to get the current date.
function convertDate(inputFormat) {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

export default function GreyPurchase({ userDetails }) {
    // Authorization state.
    const [isAllowed, setIsAllowed] = useState(false);

    // Loading states.
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isSuppliersLoading, setIsSuppliersLoading] = useState(true);
    const [isItemsLoading, setIsItemsLoading] = useState(true);

    // Form-related data.
    const [suppliers, setSuppliers] = useState([]); // for setting the account name returend in useEffect
    const [items, setItems] = useState([]);

    // Modal states.
    const [isItemModalOpen, setIsItemModalOpen] = useState(false); //toggles modal for greyitem adder
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false); // use state to handle modal toggle
    const [isTakaModalOpen, setIsTakaModalOpen] = useState(false);

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/1`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const getSuppliers = async () => {
        let type = "Sundry Creditors";
        try {
            const res = await accounts.get(`${type}`);
            setSuppliers(res.data);
            setIsSuppliersLoading(false);
        } catch (error) {
            toastError("Error retrieving account data.");
        }
    };

    const getItems = async () => {
        try {
            const res = await purchases.get("items");
            setItems(res.data);
            setIsItemsLoading(false);
        } catch (error) {
            toastError(error.response.data);
        }
    };

    useEffect(() => {
        checkPermission();
        getSuppliers();
        getItems();
    }, []);

    const closeItemModal = () => {
        setIsItemModalOpen(false);
    };

    const openTakaModal = () => {
        setIsTakaModalOpen(true);
    };

    const closeTakaModal = () => {
        setIsTakaModalOpen(false);
    };

    const closePurchaseHandler = () => {
        setIsPurchaseModalOpen(false);
    };

    const onItemAdd = async (event) => {
        event.preventDefault();

        // Post the item to backend.
        try {
            const res = await purchases.post("items", itemdetails);
            toastSuccess(res.data);
        } catch (error) {
            toastError(error.response.data);
        }

        // Close the modal.
        closeItemModal();
    };

    /* View all purchases table data. */
    const TableColData = [
        {
            Header: "Action",
            accessor: (str) => "edit",
            Cell: (tableProps) => (
                <div>
                    <button
                        className={`${styles2["form--btn"]} ${styles2["form--add-btn"]}`}
                        style={{
                            cursor: "pointer",
                        }}
                        type="submit"
                        onClick={() => {
                            onEditHandler(tableProps);
                        }}
                    >
                        edit
                    </button>
                </div>
            ),
            sticky: "left",
            Filter: "",
            width: "90px",
        },
        {
            Header: "Unique Id",
            accessor: "uid",
            show: false,
        },
        {
            Header: "Bill Number",
            accessor: "billNumber",
        },
        {
            Header: "Account Name",
            accessor: "AccName",
        },
        {
            Header: "itemName",
            accessor: "itemName",
            Filter: "",
        },
        {
            Header: "Taka",
            accessor: "taka",
            Filter: "",
        },
        {
            Header: "Mts",
            accessor: "meters",
            Filter: "",
        },
        {
            Header: "Rate",
            Filter: "",
            accessor: "rate",
        },
        {
            Header: "Amount",
            accessor: "amount",
            Filter: "",
        },
        {
            Header: "Discount",
            accessor: "discount",
            Filter: "",
        },
    ];
    /* Table data. */

    /* Purchase table data. */
    // col data for purchased items
    const purchasedListCol = [
        {
            Header: "Action",
            accessor: (str) => "delete",
            Cell: (tableProps) => (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <button
                        className={`${styles2["form--btn"]} ${styles2["form--del-btn"]}`}
                        style={{
                            cursor: "pointer",
                            width: "auto",
                            height: "auto",
                            padding: "5px",
                            margin: "0",
                        }}
                        type="submit"
                        onClick={() => {
                            settotalamount((preamount) => {
                                return parseInt(
                                    preamount -
                                        purchaseditems[tableProps.row.index]
                                            .Amount
                                );
                            });
                            setpurchaseditems((prestate) => {
                                prestate.splice(tableProps.row.index, 1);
                                return [...prestate];
                            });
                        }}
                    >
                        Delete
                    </button>
                </div>
            ),
            sticky: "left",
            Filter: "",
            maxWidth: 100,
            minWidth: 100,
            width: 100,
        },
        {
            Header: "Unique Id",
            accessor: "uid",
            show: false,
            maxWidth: 10,
            minWidth: 60,
            width: 40,
        },
        {
            Header: "Item",
            accessor: "itemName",
            Filter: "",
            maxWidth: 200,
            minWidth: 170,
            width: 100,
        },
        {
            Header: "Taka",
            accessor: "Taka",
            Filter: "",
            maxWidth: 70,
            minWidth: 100,
            width: 70,
        },
        {
            Header: "Meters",
            accessor: "Mts",
            Filter: "",
            maxWidth: 70,
            minWidth: 70,
            width: 70,
        },
        {
            Header: "Rate",
            Filter: "",
            accessor: "Rate",
            maxWidth: 70,
            minWidth: 70,
            width: 40,
        },
        {
            Header: "Amount",
            accessor: "Amount",
            Filter: "",
            maxWidth: 90,
            minWidth: 90,
            width: 90,
        },
        // {
        //     Header: "Discount",
        //     accessor: "Discount",
        //     Filter: "",
        // },
    ];
    /* Purchase table data. */

    const [totalamount, settotalamount] = useState(""); // THIS IS THE FINAL AMOUNT OF THE BILL

    const [tabledata, settabledata] = useState([]); // for modal table
    const [purchaseditems, setpurchaseditems] = useState([]); // list of purchased items

    const [formData, setFormData] = useState({
        // BillNo: "",
        billNumber: "",
        // BillDate: date,
        billDate: convertDate(new Date()),
        // accntnames: "DEFAULT",
        accountID: "DEFAULT",
        // ChallanNo: "",
        // ChallanDate: date,
        // itemName: 0,
        itemID: 0,
        Mts: "",
        Rate: "",
        Amount: "",
        Discount: "",
        DiscountAmt: "",
        NetAmount: "",
    });

    const [takaList, setTakaList] = useState([]); // used to hold info about taka details

    // useeffect to upadte the data
    useEffect(() => {
        const dis =
            Math.round(
                ((formData.Discount / 100) * formData.Amount + Number.EPSILON) *
                    100
            ) / 100;
        setFormData({
            ...formData,
            Amount: formData.Rate * formData.Mts,
            DiscountAmt: dis,
        });
    }, [formData.Rate, formData.Mts, formData.Discount]);

    // for adding a new item
    const [itemdetails, setItemdetails] = useState({
        itemname: "",
        openingmts: "",
        ratepermts: "",
    });

    // function to handle any changes
    const onChangeHandler = (event) => {
        // console.log(formData);
        // selected item uuid is shown here
        // if (event.target.name === "itemName") {
        //     const index = event.target.selectedIndex;
        //     const el = event.target.childNodes[index];
        //     const option = el.getAttribute("id");
        //     console.log("UUID of item selected ", option);
        // }

        // to check if the given input is convertable to Float? convert it, dont convert it
        let value = event.target.value;

        // if (!Number.isNaN(parseFloat(value))) {
        //     value = parseFloat(value);
        // }

        setFormData({
            ...formData,
            [event.target.name]: value,
        });
    };

    // function to handle onsubmit form request
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        // const res = await purchases.post("addgreypurchase", formData);

        // Adding item to the table.

        const newItem = {
            itemID: formData.itemID,
            itemName: items.filter((item) => item.itemID == formData.itemID)[0]
                .itemName,
            Mts: formData.Mts,
            Rate: formData.Rate,
            Amount:
                Math.round(
                    parseFloat(document.getElementById("NetAmount").value) * 100
                ) / 100,
            billNumber: formData.billNumber,
            Discount: formData.Discount,
            Taka: formData.Taka,
            takaList,
        };

        setpurchaseditems((preitems) => {
            return [...preitems, newItem];
        });

        if (1) {
            toastSuccess("Item Added to the list!");
            settotalamount((presamount) => {
                return parseFloat(presamount + newItem.Amount);
            });
            setTakaList([]);
            settotalmts(0);
            setFormData({
                ...formData,
                Mts: "",
                Rate: "",
                Amount: "",
                Discount: "",
                NetAmount: "",
                DiscountAmt: "",
                Taka: "",
            });
        }
    };

    // if edit is selected when the edit button is clicked on the table
    const onEditHandler = (tableprops) => {
        setIsPurchaseModalOpen(false);
        /* Incomplete. */
    };

    const onMainSubmit = async () => {
        const datasend = {
            formData,
            purchaseditems,
            totalamount,
        };
        const res = await purchases.post("addbilldetails", datasend); // adds data about the bill

        if (res.data.status === "1") {
            toastSuccess("Bill added successfully!");
            setFormData({
                ...formData,
                billNumber: "",
                accountID: "DEFAULT",
            });
            setpurchaseditems([]);
            settotalamount(0);
        } else {
            toastError(`Error ${res.data.sqlMessage}`);
        }
    };

    const [totalmts, settotalmts] = useState(0);

    // useeffct to set challan No
    // useEffect(() => {
    //     (async () => {
    //         const challanNo = await purchases.get("fetchChallanNo");
    //         let varChallan = 0;
    //         if (challanNo.data[0].challanNo !== null)
    //             varChallan = challanNo.data[0].challanNo;
    //         setFormData({
    //             ...formData,
    //             ChallanNo: varChallan + 1,
    //         });
    //     })();
    // }, [settotalamount]);

    // when view all pucrchased isclicked
    const onViewBillHandler = async () => {
        // Open modal.
        setIsPurchaseModalOpen(true);

        // Fetch bills.
        const res = await purchases.get("fetchGreyBills");

        console.log(res.data);

        // Calculations for rendering.
        res.data.forEach((item, index) => {
            const date = new Date(item.billDate);
            // const date2 = new Date(item.ChallanDate);
            item.billDate = date.toLocaleDateString();
            // item.ChallanDate = date2.toLocaleDateString();
        });
        settabledata(res.data);
    };

    // function that handles data recived from child taka component
    const onTakaHandler = (takaData) => {
        setTakaList(takaData.tabledata);
        setIsTakaModalOpen(false);
        setFormData({
            ...formData,
            Taka: takaData.tabledata.length,
            Mts: takaData.totalmts,
        });
        settotalmts(takaData.totalmts);
        toastSuccess("Taka Details Saved");
    };

    /* ----------------------------------------Loading---------------------------------------- */

    if (isAllowedLoading || isSuppliersLoading || isItemsLoading) {
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
    /* ----------------------------------------Loading---------------------------------------- */

    return (
        <div className={styles2["main"]}>
            <h2>Grey Purchase</h2>
            <form onSubmit={onSubmitHandler} className={styles2["form"]}>
                <div className={styles2["form--group"]}>
                    <div
                        className={styles2["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <input
                            type="number"
                            name="billNumber"
                            value={formData.billNumber}
                            onChange={onChangeHandler}
                            placeholder="Bill Number"
                            className={styles2["form--input"]}
                            style={{
                                width: "10vw",
                                minWidth: "150px",
                                marginRight: "15px",
                            }}
                            required
                        />
                        <input
                            type="text"
                            name="billDate"
                            value={formData.billDate}
                            onChange={onChangeHandler}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => (e.target.type = "text")}
                            placeholder="Bill Date"
                            className={styles2["form--input"]}
                            style={{ width: "150px", minWidth: "150px" }}
                            required
                        />
                    </div>
                    <select
                        name="accountID"
                        onChange={onChangeHandler}
                        required
                        value={formData.accountID}
                        className={`${styles2["form--input"]} ${styles2["form--input-select"]}`}
                        style={{
                            width: "20vw",
                            minWidth: "250px",
                            margin: "10px 15px 10px 15px",
                        }}
                    >
                        <option value="DEFAULT" disabled hidden>
                            Select supplier...
                        </option>
                        {suppliers.map((supplier) => {
                            return (
                                <option value={supplier.uid} key={supplier.uid}>
                                    {supplier.AccName}
                                </option>
                            );
                        })}
                    </select>
                    <div
                        className={styles2["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <select
                            name="itemID"
                            value={formData.itemID}
                            onChange={onChangeHandler}
                            className={`${styles2["form--input"]} ${styles2["form--input-select"]}`}
                            style={{
                                width: "15vw",
                                minWidth: "197.5px",
                                marginRight: "15px",
                            }}
                            required
                        >
                            <option value="0" disabled hidden>
                                Select item...
                            </option>
                            {items.map((item) => {
                                return (
                                    <option
                                        value={item.itemID}
                                        key={item.itemID}
                                    >
                                        {item.itemName}
                                    </option>
                                );
                            })}
                        </select>
                        <button
                            type="button"
                            onClick={() => {
                                setIsItemModalOpen(true);
                            }}
                            className={`${styles2["form--btn"]} ${styles2["form--add-btn"]}`}
                            style={{ width: "87.5px", minWidth: "87.5px" }}
                        >
                            Add Item
                        </button>
                    </div>
                </div>
                {/* <div className="secondline--greypurchase">
                    <label>Challan date</label>
                        <input
                            style={{ width: "140px" }}
                            type="date"
                            value={formData.ChallanDate}
                            name="challanDate"
                            onChange={onChangeHandler}
                        />
                    <label>
                            Challan No.
                            <input
                                type="text"
                                value={formData.ChallanNo}
                                name="ChallanNo"
                                disabled
                                required
                                onChange={onChangeHandler}
                            />
                        </label>

                    </div> */}
                <div className={styles2["form--group"]}>
                    <div
                        className={styles2["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <input
                            name="Taka"
                            type="number"
                            placeholder="Taka"
                            value={formData.Taka}
                            onChange={onChangeHandler}
                            className={styles2["form--input"]}
                            style={{
                                width: "10vw",
                                minWidth: "87.5px",
                                marginRight: "15px",
                            }}
                        />
                        <button
                            type="button"
                            onClick={openTakaModal}
                            className={`${styles2["form--btn"]} ${styles2["form--add-btn"]}`}
                            style={{ width: "87.5px", minWidth: "87.5px" }}
                        >
                            Add Taka
                        </button>
                    </div>
                    <input
                        type="number"
                        name="Mts"
                        value={formData.Mts}
                        id="mts"
                        required
                        min="0"
                        onChange={onChangeHandler}
                        placeholder="Meters"
                        readOnly
                        className={styles2["form--input"]}
                        style={{ width: "10vw", minWidth: "150px" }}
                    />
                    <input
                        type="number"
                        id="rate"
                        name="Rate"
                        min="0"
                        value={formData.Rate}
                        onChange={onChangeHandler}
                        placeholder="Rate"
                        className={styles2["form--input"]}
                        style={{ width: "10vw", minWidth: "150px" }}
                    />
                    <input
                        type="number"
                        name="Discount"
                        placeholder="Discount %"
                        value={formData.Discount}
                        onChange={onChangeHandler}
                        min="0"
                        max="100"
                        className={styles2["form--input"]}
                        style={{ width: "10vw", minWidth: "150px" }}
                    />
                </div>
                <div className={styles2["form--group"]}>
                    <div
                        className={styles2["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                            alignItems: "center",
                        }}
                    >
                        <label htmlFor="Amount" style={{ marginRight: "10px" }}>
                            Amount w/o Discount
                        </label>
                        <input
                            type="number"
                            name="Amount"
                            value={formData.Amount}
                            id="Amount"
                            required
                            readOnly
                            className={styles2["form--input"]}
                            style={{ width: "7.5vw", minWidth: "100px" }}
                        />
                    </div>
                    <div
                        className={styles2["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                            alignItems: "center",
                        }}
                    >
                        <label htmlFor="Amount" style={{ marginRight: "10px" }}>
                            Discount Amount
                        </label>
                        <input
                            type="text"
                            name="DiscountAmt"
                            id="DiscountAmt"
                            value={formData.DiscountAmt}
                            readOnly
                            className={styles2["form--input"]}
                            style={{ width: "7.5vw", minWidth: "100px" }}
                        />
                    </div>
                    <div
                        className={styles2["form--group"]}
                        style={{
                            width: "auto",
                            margin: "0",
                            alignItems: "center",
                        }}
                    >
                        <label htmlFor="Amount" style={{ marginRight: "10px" }}>
                            Net Amount
                        </label>
                        <input
                            type="number"
                            name="NetAmount"
                            id="NetAmount"
                            value={formData.Amount - formData.DiscountAmt}
                            readOnly
                            required
                            className={styles2["form--input"]}
                            style={{ width: "7.5vw", minWidth: "100px" }}
                        />
                    </div>

                    <div
                        className={styles2["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <input
                            type="submit"
                            value="Add to List"
                            className={`${styles2["form--btn"]} ${styles2["form--add-btn"]}`}
                            style={{ width: "100px", minWidth: "100px" }}
                        />
                    </div>
                </div>
                <Modal
                    open={isPurchaseModalOpen}
                    onClose={closePurchaseHandler}
                >
                    <StickyTable
                        TableCol={TableColData}
                        TableData={tabledata}
                        style={{
                            maxWidth: "1000px",
                            width: "900px",
                            maxHeight: "500px",
                            border: "1px Solid black",
                            borderRadius: "10px",
                        }}
                    />
                </Modal>
                <div className={styles2["form--table"]}>
                    <StickyTable
                        TableCol={purchasedListCol}
                        TableData={purchaseditems}
                        style={{
                            width: "604.5px",
                            border: "2.5px solid black",
                            borderRadius: "5px",
                        }}
                    />
                </div>
                <div
                    className={styles2["form--group"]}
                    style={{ marginTop: "50px", justifyContent: "center" }}
                >
                    <button
                        onClick={onViewBillHandler}
                        type="button"
                        className={`${styles2["form--btn"]} ${styles2["form--add-btn"]}`}
                        style={{
                            backgroundColor: "#2297be",
                            width: "150px",
                            minWidth: "150px",
                        }}
                    >
                        View Purchases
                    </button>
                    <input
                        type="text"
                        disabled
                        placeholder="Total Amount"
                        value={totalamount > 0 ? totalamount : "Final Amount"}
                        className={styles2["form--input"]}
                        style={{
                            width: "150px",
                            minWidth: "150px",
                            margin: "10px 15px 10px 15px",
                        }}
                    />

                    <button
                        disabled={purchaseditems.length > 0 ? false : true}
                        type="button"
                        onClick={onMainSubmit}
                        className={`${styles2["form--btn"]} ${styles2["form--add-btn"]}`}
                        style={{
                            width: "150px",
                            minWidth: "150px",
                        }}
                    >
                        Save Bill
                    </button>
                </div>
            </form>
            <Modal open={isItemModalOpen} onClose={closeItemModal}>
                <form className="greypurchase--itemadd" onSubmit={onItemAdd}>
                    <label>
                        Item Name:
                        <input
                            type="text"
                            required
                            value={itemdetails.itemname}
                            onChange={(e) =>
                                setItemdetails({
                                    ...itemdetails,
                                    itemname: e.target.value,
                                })
                            }
                        />
                    </label>
                    <label>
                        Opening Mts:
                        <input
                            type="number"
                            value={itemdetails.openingmts}
                            onChange={(e) =>
                                setItemdetails({
                                    ...itemdetails,
                                    openingmts: e.target.value,
                                })
                            }
                        />
                    </label>
                    <label>
                        Rate per Mts:
                        <input
                            type="number"
                            value={itemdetails.ratepermts}
                            onChange={(e) =>
                                setItemdetails({
                                    ...itemdetails,
                                    ratepermts: e.target.value,
                                })
                            }
                        />
                    </label>
                    <button>Add item</button>
                </form>
            </Modal>
            <Modal open={isTakaModalOpen} onClose={closeTakaModal}>
                <TakaDetails
                    takaList={takaList}
                    totalMts={totalmts}
                    onTakaHandler={onTakaHandler}
                />
            </Modal>
        </div>
    );
}
