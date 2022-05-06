import React, { useEffect, useState } from "react";
import styles from "../../../styles/SendJob.module.css";
import Modal from "../../../components/Reuse_components/Modal";
import StickyTable from "../../../components/Reuse_components/Table/StickyTable";
import styles2 from "../Mill/styles/Mill.module.css";
import axios from "axios";
import ReactLoading from "react-loading";
import {
    toastError,
    toastSuccess,
} from "../../../components/Reuse_components/toast";

// Axios default configuration to include cookie and user ID with every request.
axios.defaults.withCredentials = true;
axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

// Axios instances.
const accounts = axios.create({
    baseURL: "http://localhost:3003/accountMaster",
});
const purchases = axios.create({
    baseURL: "http://localhost:3005/purchases",
});

// helper function to get the current date
function convertDate(inputFormat) {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

function GeneralPurchases({ userDetails }) {
    //table data
    const tablecoldata = [
        {
            Header: "Unique Id",
            accessor: "uid",
            show: false,
        },
        {
            Header: "Account name",
            accessor: "accntname",
        },
        {
            Header: "Item Name",
            accessor: "itemname",
        },
        {
            Header: "Quantity",
            accessor: "quantity",
            Filter: "",
        },
        {
            Header: "Price Per Qty",
            accessor: "priceperqty",
            Filter: "",
        },
        {
            Header: "Total Amount",
            accessor: "totalamount",
            Filter: "",
        },
        {
            Header: "Action",
            accessor: (str) => "Delete",
            Cell: (tableProps) => (
                <div className="btn-grp">
                    <button
                        className={`${styles2["form--btn"]} ${styles2["form--del-btn"]}`}
                        onClick={() => {
                            onDeleteRow(tableProps);
                        }}
                    >
                        Delete
                    </button>
                    <button
                        className={`${styles2["form--btn"]} ${styles2["form--edit-btn"]}`}
                        onClick={() => {
                            onEditrow(tableProps);
                        }}
                    >
                        Edit
                    </button>
                </div>
            ),
            sticky: "left",
            Filter: "",
        },
    ];

    // Authorization state.
    const [isAllowed, setIsAllowed] = useState(false);

    // Loading states.
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isAccountsLoading, setIsAccountsLoading] = useState(true);

    const [modal, setModal] = useState(false);
    const [tabledata, settabledata] = useState([]);
    const [accntid, setaccntid] = useState("");
    const [state, setState] = useState({
        uuid: "",
        billno: "",
        accntname: "",
        billdate: convertDate(new Date()),
        itemname: "",
        quantity: "",
        priceperqty: "",
    });
    const [editmode, setEditmode] = useState(false);
    const [totalamount, setTotalamount] = useState(0);
    const [accntlist, setaccntlist] = useState([]);

    // clearing all fields
    const clearall = () => {
        setState({
            uuid: "",
            accntname: "",
            billno: "",
            billdate: convertDate(new Date()),
            itemname: "",
            priceperqty: "",
            quantity: "",
        });
        setTotalamount(0);
        setaccntid("");
    };

    // On input change
    const onChangeHandler = (e) => {
        let val = e.target.value;
        const name = e.target.id;
        if (name === "billno") {
            val = parseInt(val);
        }

        if (name === "quantity" || name === "priceperqty") {
            const value =
                document.getElementById("quantity").value *
                document.getElementById("priceperqty").value;
            setTotalamount(value);
        }
        if (name === "accntname") {
            const index = e.target.selectedIndex;
            const el = e.target.childNodes[index];
            const uid = el.getAttribute("id");
            console.log("UUID of item selected ", uid);
            setaccntid(uid);
        }

        setState({
            ...state,
            [name]: val,
        });
    };

    //on deleting a row from the table
    const onDeleteRow = async (tableProps) => {
        const res = await purchases.delete(
            `/deletegeneralpurchase/${tableProps.row.original.uuid}`
        );

        if (res.data == "1") {
            toastSuccess("Item Deleted");
            const datacopy = [...tabledata];
            datacopy.splice(tableProps.row.index, 1);
            settabledata(datacopy);
        } else {
            toastError(`Error ${res.data.sqlMessage}`);
        }
    };

    const onEditrow = async (tableProps) => {
        setModal(false);
        setState({
            uuid: tableProps.row.original.uuid,
            accntname: tableProps.row.original.accntname,
            itemname: tableProps.row.original.itemname,
            quantity: tableProps.row.original.quantity,
            priceperqty: tableProps.row.original.priceperqty,
        });
        setTotalamount(tableProps.row.original.totalamount);
        setEditmode(true);
    };

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/2`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAccounts = async () => {
        const type = "Creditors for expenses";
        try {
            const res = await accounts.get(`${type}`);
            setaccntlist(res.data);
            setIsAccountsLoading(false);
        } catch (e) {
            console.log(e.response.data);
        }
    };

    useEffect(() => {
        checkPermission();
        fetchAccounts();
    }, []);

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const data = {
            state,
            totalamount,
            CrDr: "Cr",
            accntType: "Creditors for expenses",
            accntid: accntid,
        };
        console.log(data);
        (async () => {
            try {
                const res = await purchases.post("addgeneralpurchase", data);
                toastSuccess("Item added");
                clearall();
            } catch (e) {
                toastError(`Error ${e.response.data}`);
            }
        })();
    };

    // cancels the edit mode
    const onEditCancel = () => {
        setEditmode(false);
        clearall();
    };

    // submits the data form given by the user
    const onEditData = async () => {
        const data = {
            ...state,
            totalamount,
        };
        try {
            const res = await purchases.put(
                `updategeneralpurchase/${state.uuid}`,
                data
            );
            toastSuccess("Updated");
            clearall();
        } catch (e) {
            toastError(e.response.data);
        }
        setEditmode(false);
    };

    if (isAllowedLoading || isAccountsLoading) {
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
        <div className={styles2["main"]}>
            <h2>General Purchase</h2>
            <form onSubmit={onFormSubmit} className={styles2["form"]}>
                {/* Row 1 */}
                <div
                    className={styles2["form--group"]}
                    style={{ justifyContent: "space-around" }}
                >
                    <div
                        className={styles2["form--group"]}
                        style={{ width: "auto", margin: "0" }}
                    >
                        <input
                            type="number"
                            name="billNumber"
                            value={state.billno}
                            id="billno"
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
                            value={state.billdate}
                            id="billdate"
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
                        id="accntname"
                        required
                        onChange={onChangeHandler}
                        value={state.accntname}
                        className={`${styles2["form--input"]} ${styles2["form--input-select"]}`}
                        style={{
                            width: "20vw",
                            minWidth: "250px",
                            margin: "10px 0",
                        }}
                    >
                        <option value="" disabled hidden>
                            Select account...
                        </option>
                        {accntlist.map((obj, index) => {
                            return (
                                <option
                                    value={obj.AccName}
                                    key={index}
                                    id={obj.uid}
                                >
                                    {obj.AccName}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Row 2 */}
                <div
                    className={styles2["form--group"]}
                    // style={{ justifyContent: "space-around" }}
                >
                    <input
                        placeholder="Item Name"
                        type="text"
                        value={state.itemname}
                        id="itemname"
                        required
                        onChange={onChangeHandler}
                        className={styles2["form--input"]}
                    />
                    <input
                        placeholder="Quantity"
                        type="number"
                        value={state.quantity}
                        id="quantity"
                        required
                        onChange={onChangeHandler}
                        className={styles2["form--input"]}
                        style={{
                            width: "10vw",
                            minWidth: "87.5px",
                            marginRight: "15px",
                        }}
                    />
                    <input
                        placeholder="Price / Quantity"
                        type="number"
                        value={state.priceperqty}
                        id="priceperqty"
                        required
                        onChange={onChangeHandler}
                        className={styles2["form--input"]}
                        style={{
                            width: "10vw",
                            minWidth: "87.5px",
                            marginRight: "15px",
                        }}
                    />
                    <input
                        id="totalamount"
                        type="number "
                        required
                        value={totalamount === 0 ? "Total Amount" : totalamount}
                        className={styles2["form--input"]}
                        style={{
                            width: "10vw",
                            minWidth: "87.5px",
                            marginRight: "15px",
                        }}
                        readOnly
                    />
                </div>

                <div
                    className={styles2["form--group"]}
                    style={{
                        justifyContent: "space-around",
                        marginTop: "10vh",
                    }}
                >
                    {!editmode && (
                        <button
                            className={`${styles["add-btn"]} ${styles["btn"]}`}
                        >
                            Submit
                        </button>
                    )}
                    {editmode && (
                        <div>
                            <button
                                className={`${styles["edit-btn"]} ${styles["btn"]}`}
                                type="button"
                                onClick={onEditData}
                            >
                                Edit
                            </button>
                            <button
                                className={`${styles["edit-btn"]} ${styles["btn"]}`}
                                type="button"
                                onClick={onEditCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <button
                        type="button"
                        className={`${styles["add-btn"]} ${styles["btn"]}`}
                        onClick={() => {
                            (async function fetchdata() {
                                setModal(true);

                                try {
                                    const res = await purchases.get(
                                        "fetchgeneralpurchase"
                                    );
                                    settabledata(res.data);
                                    toastSuccess("Bills fetched!");
                                } catch (e) {
                                    console.log(e.response.data);
                                }
                            })();
                        }}
                    >
                        View all items
                    </button>
                </div>
            </form>

            {/* Modal. */}
            <Modal open={modal} onClose={() => setModal(false)}>
                <h2 style={{ marginBottom: "2vh" }}>General Purchases</h2>
                <StickyTable
                    TableCol={tablecoldata}
                    TableData={tabledata}
                    style={{
                        maxWidth: "80vw",
                        maxHeight: "70vh",
                    }}
                />
            </Modal>
        </div>
    );
}

export default GeneralPurchases;
