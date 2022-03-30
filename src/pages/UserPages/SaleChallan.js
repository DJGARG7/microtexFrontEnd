import { useState, useEffect } from "react";
import Axios from "axios";
import toast from "react-hot-toast";
const SaleChallan = () => {
    const [challan, setChallan] = useState("");
    const [custName, setCustName] = useState("none");
    const [sdlist, setSdlist] = useState([]);
    const type = "Creditors For Job";
    useEffect(async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3003/accountMaster/${type}`
            );
            setSdlist(res.data);
        } catch (e) {
            toast.error("Error loading CFJ data", {
                style: {
                    borderRadius: "15px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    }, []);
    const submitHandler = () => {};
    const addItemHandler = () => {};
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
                    // disabled={!isEntering}
                    style={{ marginLeft: "10%" }}
                >
                    <option value="none" disabled hidden>
                        Customer Name
                    </option>
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
                    name="challan"
                    value={challan}
                    placeholder="Challan No."
                    onChange={(e) => setChallan(e.target.value)}
                    // disabled={!isEntering}
                    // className={`${styles["input-text"]}`}
                    style={{ marginRight: "10%" }}
                    required
                />
                <br></br>
                <select
                    // className={styles["input-select"]}
                    name="custName"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    // disabled={!isEntering}
                    style={{ marginLeft: "10%" }}
                >
                    <option value="none" disabled hidden>
                        Design Name
                    </option>
                    {sdlist.map((sd) => {
                        return (
                            <option value={sd.uid} key={sd.uid}>
                                {sd.AccName}
                            </option>
                        );
                    })}
                </select>
                <select
                    // className={styles["input-select"]}
                    name="custName"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    // disabled={!isEntering}
                    style={{ marginLeft: "10%" }}
                >
                    <option value="none" disabled hidden>
                        Cloth Type
                    </option>
                    {sdlist.map((sd) => {
                        return (
                            <option value={sd.uid} key={sd.uid}>
                                {sd.AccName}
                            </option>
                        );
                    })}
                </select>
                <input
                    type="number"
                    name="challan"
                    value={challan}
                    placeholder="Rate"
                    onChange={(e) => setChallan(e.target.value)}
                    // disabled={!isEntering}
                    // className={`${styles["input-text"]}`}
                    style={{ marginRight: "10%" }}
                    required
                />
                <input
                    type="number"
                    name="challan"
                    value={challan}
                    placeholder="Quantity"
                    onChange={(e) => setChallan(e.target.value)}
                    // disabled={!isEntering}
                    // className={`${styles["input-text"]}`}
                    style={{ marginRight: "10%" }}
                    required
                />
                <button type="button" onClick={addItemHandler}>Add item</button>
                {/* item tables */}
                <button>Add Challan</button>
            </form>
        </div>
    );
};

export default SaleChallan;
