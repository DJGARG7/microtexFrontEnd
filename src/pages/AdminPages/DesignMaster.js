import { useEffect, useState } from "react";
import Modal from "../../components/Reuse_components/Modal";
import styles from "../../styles/AccountMaster.module.css";
import Axios from "axios";
import toast from "react-hot-toast";

import DesignMasterTable from "../../components/Admin_components/DesignMasterTable";

const instance = Axios.create({
    baseURL: "http://localhost:3004/designMaster/",
});

const DesignMaster = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEntering, setIsEntering] = useState(true);
    const [disMode, setDisMode] = useState(0);

    const [Dno, setDno] = useState("");
    const [DName, setDName] = useState("");

    const [bcost, setBcost] = useState("");
    const [clothType, setClothType] = useState("");

    const [wcost, setWcost] = useState("");
    const [wname, setWname] = useState("none");

    const [lcost, setLcost] = useState("");
    const [lname, setLname] = useState("none");

    const [dcost, setDcost] = useState("");
    const [diamname, setDiamname] = useState("none");

    const [pcost, setPcost] = useState("");
    const [mu, setMU] = useState("");

    const [calPrice, setCalPrice] = useState(0);

    const [cfjlist, setCfjlist] = useState([]);

    const buttonModes = {
        0: [
            { dis: true, label: "Delete" },
            { dis: isNaN(calPrice) ? true : false, label: "Add" },
            { dis: false, label: "View all data" },
            { dis: true, label: "Cancel" },
            { dis: false, label: "Exit" },
        ],
        1: [
            { dis: false, label: "Delete" },
            { dis: true, label: "Add" },
            { dis: false, label: "Edit" },
            { dis: true, label: "Cancel" },
            { dis: false, label: "Exit" },
        ],
        2: [
            { dis: true, label: "Delete" },
            { dis: isNaN(calPrice) ? true : false, label: "Save" },
            { dis: true, label: "Edit" },
            { dis: false, label: "Cancel" },
            { dis: false, label: "Exit" },
        ],
    };
    const type = "Creditors For Job";
    useEffect(async () => {
        try {
            const res = await Axios.get(
                `http://localhost:3003/accountMaster/${type}`
            );
            setCfjlist(res.data);
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

    const addSaveHandler = async (event) => {
        event.preventDefault();
        const data = [
            Dno,
            DName,
            clothType,
            parseInt(bcost),
            parseInt(wcost),
            parseInt(lcost),
            parseInt(dcost),
            parseInt(pcost),
            parseInt(mu),
            parseInt(calPrice),
            wname,
            lname,
            diamname,
        ];
        //data insert
        if (disMode === 0) {
            try {
                const res = await Axios.post(
                    "http://localhost:3004/designMaster/",
                    data
                );
                // const res = await instance.post("", data);
                if (res.data == 1) {
                    console.log("data added to db");
                    toast.success("Account added successfully!", {
                        style: {
                            borderRadius: "15px",
                            background: "#333",
                            color: "#fff",
                        },
                    });
                    setDisMode(1);
                    setIsEntering(false);
                } else {
                    throw res.data;
                }
            } catch (error) {
                console.log(error);
                toast.error("Addition failed!", {
                    style: {
                        borderRadius: "15px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
        }
        //data update
        if (disMode === 2) {
            try {
                const res = await instance.put(Dno, data);
                if (res.data === 1) {
                    console.log("data updated in  db");
                    toast.success("Account updated successfully!", {
                        style: {
                            borderRadius: "15px",
                            background: "#333",
                            color: "#fff",
                        },
                    });
                    setDisMode(1);
                    setIsEntering(false);
                } else {
                    throw res.data;
                }
            } catch (error) {
                console.log(error);
                toast.error("Updation failed!", {
                    style: {
                        borderRadius: "15px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
        }
    };
    //delete data
    const deleteHandler = async () => {
        if (disMode === 1) {
            try {
                const res = await instance.delete(Dno);
                if (res.data == 1) {
                    toast.success("Deleted successfully!", {
                        style: {
                            borderRadius: "15px",
                            background: "#333",
                            color: "#fff",
                        },
                    });
                    exitHandler();
                } else {
                    throw res.data;
                }
            } catch (error) {
                console.log(error);
                toast.error("Deletion failed!", {
                    style: {
                        borderRadius: "15px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
        }
    };

    // return to default screen like on reload
    const exitHandler = () => {
        setDisMode(0);
        setIsEntering(true);

        setDno("");
        setDName("");
        setClothType("");
        setBcost("");
        setWcost("");
        setLcost("");
        setDcost("");
        setPcost("");
        setMU("");
        setCalPrice("");
        setWname("none");
        setLname("none");
        setDiamname("none");
    };
    const showHandler = (rowdetails) => {
        console.log(rowdetails);
        setDisMode(1);
        setIsEntering(false);
        setIsOpen(false);

        setDno(rowdetails.Dno);
        setDName(rowdetails.NAME);
        setClothType(rowdetails.CLOTH_TYPE);
        setBcost(rowdetails.BASIC_COST);
        setWcost(rowdetails.WORK_COST);
        setLcost(rowdetails.LACE_COST);
        setDcost(rowdetails.DIAMOND_COST);
        setPcost(rowdetails.PACKING_COST);
        setMU(rowdetails.MU);
        setCalPrice(rowdetails.CALC_PRICE);
        setWname(rowdetails.WORK_JOB);
        setLname(rowdetails.LACE_JOB);
        setDiamname(rowdetails.DIAM_JOB);
    };
    //closes modal
    const closeHandler = () => {
        setIsOpen(false);
    };
    const editViewHandler = async () => {
        if (disMode === 0) {
            setIsOpen(true);
        }
        if (disMode === 1) {
            setDisMode(2);
            setIsEntering(true);
        }
    };
    const cancelHandler = () => {
        if (disMode === 2) {
            setDisMode(1);
            setIsEntering(false);
        }
    };

    useEffect(() => {
        calcHandler();
    }, [bcost, wcost, lcost, dcost, pcost, mu]);
    const calcHandler = () => {
        setCalPrice(
            ((parseInt(bcost) +
                parseInt(wcost) +
                parseInt(lcost) +
                parseInt(dcost) +
                parseInt(pcost)) *
                100) /
                (100 - parseInt(mu))
        );
        console.log("running");
    };
    return (
        <div className={styles["main"]}>
            <h2>Design Master</h2>
            <div className={styles["form-main"]}>
                <form onSubmit={addSaveHandler} className={styles["form"]}>
                    <div className={styles["form-group"]}>
                        <input
                            type="number"
                            name="Dno"
                            value={Dno}
                            placeholder="Design Number"
                            onChange={(e) => setDno(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginRight: "10%" }}
                            required
                        />
                        <input
                            type="text"
                            name="DName"
                            value={DName}
                            placeholder="Design Name"
                            onChange={(e) => setDName(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginLeft: "10%" }}
                            required
                        />
                    </div>
                    <div className={styles["form-group"]}>
                        <input
                            type="number"
                            name="bcost"
                            value={bcost}
                            placeholder="Basic Cost"
                            onChange={(e) => setBcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginRight: "10%" }}
                            required
                        />
                        <input
                            type="text"
                            name="clothType"
                            value={clothType}
                            placeholder="Cloth Type"
                            onChange={(e) => setClothType(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginLeft: "10%" }}
                            required
                        />
                    </div>
                    <div className={styles["form-group"]}>
                        <input
                            type="number"
                            name="wcost"
                            value={wcost}
                            placeholder="Work Cost"
                            onChange={(e) => setWcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginRight: "10%" }}
                            required
                        />
                        <select
                            className={styles["input-select"]}
                            name="wname"
                            value={wname}
                            onChange={(e) => setWname(e.target.value)}
                            disabled={!isEntering}
                            style={{ marginLeft: "10%" }}
                        >
                            <option value="none" disabled hidden>
                                work job by...
                            </option>
                            {cfjlist.map((cfj) => {
                                return (
                                    <option value={cfj.uid} key={cfj.uid}>
                                        {cfj.AccName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className={styles["form-group"]}>
                        <input
                            type="number"
                            name="lcost"
                            value={lcost}
                            placeholder="Lace Cost"
                            onChange={(e) => setLcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginRight: "10%" }}
                            required
                        />
                        <select
                            className={styles["input-select"]}
                            name="lname"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            disabled={!isEntering}
                            style={{ marginLeft: "10%" }}
                        >
                            <option value="none" disabled hidden>
                                Lace job by...
                            </option>
                            {cfjlist.map((cfj) => {
                                return (
                                    <option value={cfj.uid} key={cfj.uid}>
                                        {cfj.AccName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className={styles["form-group"]}>
                        <input
                            type="number"
                            name="dcost"
                            value={dcost}
                            placeholder="Diamond Cost"
                            onChange={(e) => setDcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginRight: "10%" }}
                            required
                        />
                        <select
                            className={styles["input-select"]}
                            name="diamname"
                            value={diamname}
                            onChange={(e) => setDiamname(e.target.value)}
                            disabled={!isEntering}
                            style={{ marginLeft: "10%" }}
                        >
                            <option value="none" disabled hidden>
                                Diamond job by...
                            </option>
                            {cfjlist.map((cfj) => {
                                return (
                                    <option value={cfj.uid} key={cfj.uid}>
                                        {cfj.AccName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className={styles["form-group"]}>
                        <input
                            type="number"
                            name="pcost"
                            value={pcost}
                            placeholder="Packing Cost"
                            onChange={(e) => setPcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginRight: "10%" }}
                            required
                        />
                        <input
                            type="number"
                            name="mu"
                            value={mu}
                            placeholder="Enter MU"
                            onChange={(e) => setMU(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]}`}
                            style={{ marginLeft: "10%" }}
                            required
                        />
                    </div>
                    <input
                        type="text"
                        name="calPrice"
                        value={isNaN(calPrice) ? "Calculated Price" : calPrice}
                        // placeholder="Calculated Price"
                        onChange={(e) => setCalPrice(parseInt(e.target.value))}
                        disabled
                        className={`${styles["input-text"]}`}
                        required
                        disabled
                        style={{
                            width: "20%",
                            alignSelf: "center",
                            margin: "50px 0 50px 0",
                            textAlign: "center",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    />
                    <button
                        disabled={buttonModes[disMode][1].dis}
                        className={`${styles["add-btn"]} ${styles["btn"]}`}
                    >
                        {buttonModes[disMode][1].label}
                    </button>
                </form>
                <div className={styles["button-group"]}>
                    <button
                        disabled={buttonModes[disMode][0].dis}
                        onClick={deleteHandler}
                        className={`${styles["btn"]} ${styles["del-btn"]}`}
                    >
                        {buttonModes[disMode][0].label}
                    </button>

                    <button
                        disabled={buttonModes[disMode][2].dis}
                        onClick={editViewHandler}
                        className={`${styles["btn"]} ${styles["view-all-data-btn"]}`}
                    >
                        {buttonModes[disMode][2].label}
                    </button>
                    <button
                        disabled={buttonModes[disMode][3].dis}
                        onClick={cancelHandler}
                        className={`${styles["btn"]} ${styles["del-btn"]}`}
                    >
                        {buttonModes[disMode][3].label}
                    </button>
                    <button
                        disabled={buttonModes[disMode][4].dis}
                        onClick={exitHandler}
                        className={`${styles["btn"]} ${styles["del-btn"]}`}
                    >
                        {buttonModes[disMode][4].label}
                    </button>
                </div>
            </div>
            <Modal open={isOpen} onClose={closeHandler}>
                <DesignMasterTable showclick={showHandler} />
            </Modal>
        </div>
    );
};
export default DesignMaster;
