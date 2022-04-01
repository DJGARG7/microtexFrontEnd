import { useState, useEffect } from "react";
import Axios from "axios";
import {
    toastError,
    toastSuccess,
} from "../../components/Reuse_components/toastError";
import StickyTable from "../../components/Reuse_components/Table/StickyTable";
const current = new Date();
const SaleChallan = () => {
    const currDate = [
        current.getFullYear(),
        ("0" + (current.getMonth() + 1)).slice(-2),
        ("0" + current.getDate()).slice(-2),
    ].join("-");
    const TableColData = [
        {
            Header: "Design Name",
            accessor: "DName",
            Filter: "",
        },
        {
            Header: "Cloth Type",
            accessor: "clothType",
            Filter: "",
        },
        {
            Header: "Rate",
            accessor: "rate",
            Filter: "",
        },
        {
            Header: "Quantity",
            accessor: "quantity",
            Filter: "",
        },
    ];
    //for items in table
    const [itemList, setItemList] = useState([]);

    const [challan, setChallan] = useState("");
    const [custName, setCustName] = useState("");
    const [SCdate, setSCDate] = useState(currDate);

    const [DName, setDName] = useState("none");
    const [clothType, setClothType] = useState("none");
    const [rate, setRate] = useState("");
    const [quantity, setQuantity] = useState("");

    // list of sundry debtors
    const [sdlist, setSdlist] = useState([]);
    const [DNamelist, setDNamelist] = useState([]);
    const [clothlist, setClothlist] = useState([]);
    const type = "Creditors For Job";
    useEffect(async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3003/accountMaster/${type}`
            );
            setSdlist(res.data);
            const res1 = await Axios.get(
                "http://localhost:3004/designMaster/nameAndType"
            );
            setDNamelist(res1.data[0]);
            setClothlist(res1.data[1]);
        } catch (e) {
            toastError("Error loading SD data");
        }
    }, []);

    const addItemHandler = () => {
        try {
            if (DName === "none") {
                throw "Select Design Name";
            } else if (clothType === "none") {
                throw "Select Cloth Type";
            } else if (rate <= 0 || quantity <= 0) {
                throw "Enter valid rate/quantity";
            }
            setItemList([
                ...itemList,
                {
                    DName: DName,
                    clothType: clothType,
                    rate: rate,
                    quantity: quantity,
                },
            ]);
            setDName("none");
            setClothType("none");
            setRate("");
            setQuantity("");
        } catch (message) {
            toastError(message);
        }
    };
    const deleteItemHandler = () => {};
    //insert into db
    const submitHandler = async (e) => {
        e.preventDefault();
        const data = [challan, custName, SCdate, itemList];
        try {
            const res = await Axios.post("http://localhost:3005/sales/", data);
            if (res.data != 1) throw res.data;
            console.log("data added to db");
            toastSuccess("Challan Added");
            setChallan("");
            setCustName("");
            setItemList([]);
        } catch (error) {
            console.log(error);
            toastError("Addition failed!");
        }
    };
    return (
        <div>
            Sale Challan
            <form onSubmit={submitHandler}>
                <input
                    type="number"
                    name="challan"
                    value={challan}
                    placeholder="Challan No."
                    onChange={(e) => setChallan(e.target.value)}
                    // disabled={!isEntering}
                    // className={`${styles["input-text"]}`}
                    style={{ marginRight: "10%" }}
                    required
                />
                <select
                    // className={styles["input-select"]}
                    name="custName"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    required
                    // disabled={!isEntering}
                    style={{ marginLeft: "10%" }}
                >
                    <option value="">Customer Name</option>
                    {sdlist.map((sd) => {
                        return (
                            <option value={sd.uid} key={sd.uid}>
                                {sd.AccName}
                            </option>
                        );
                    })}
                </select>
                <input
                    type="date"
                    name="SCdate"
                    value={SCdate}
                    onChange={(e) => setSCDate(e.target.value)}
                    // disabled={!isEntering}
                    // className={`${styles["input-text"]}`}
                    style={{ marginRight: "10%" }}
                    required
                />
                <br></br>
                <select
                    // className={styles["input-select"]}
                    name="DName"
                    value={DName}
                    onChange={(e) => setDName(e.target.value)}
                    // disabled={!isEntering}
                    style={{ marginLeft: "10%" }}
                >
                    <option value="none" disabled hidden>
                        Design Name
                    </option>
                    {DNamelist.map((DName) => {
                        return (
                            <option value={DName.name} key={DName.name}>
                                {DName.name}
                            </option>
                        );
                    })}
                </select>
                <select
                    // className={styles["input-select"]}
                    name="clothType"
                    value={clothType}
                    onChange={(e) => setClothType(e.target.value)}
                    // disabled={!isEntering}
                    style={{ marginLeft: "10%" }}
                >
                    <option value="none" disabled hidden>
                        Cloth Type
                    </option>
                    {clothlist.map((cloth) => {
                        return (
                            <option
                                value={cloth.cloth_Type}
                                key={cloth.cloth_Type}
                            >
                                {cloth.cloth_Type}
                            </option>
                        );
                    })}
                </select>
                <input
                    type="number"
                    name="rate"
                    value={rate}
                    placeholder="Rate"
                    onChange={(e) => setRate(e.target.value)}
                    // disabled={!isEntering}
                    // className={`${styles["input-text"]}`}
                    style={{ marginRight: "10%" }}
                />
                <input
                    type="number"
                    name="quantity"
                    value={quantity}
                    placeholder="Quantity"
                    onChange={(e) => setQuantity(e.target.value)}
                    // disabled={!isEntering}
                    // className={`${styles["input-text"]}`}
                    style={{ marginRight: "10%" }}
                />
                <button type="button" onClick={addItemHandler}>
                    Add item
                </button>
                <StickyTable
                    TableCol={TableColData}
                    TableData={itemList}
                ></StickyTable>
                <button>Add Challan</button>
            </form>
        </div>
    );
};
export default SaleChallan;
