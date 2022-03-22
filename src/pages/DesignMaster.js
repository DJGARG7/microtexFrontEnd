import { useState } from "react";
import Modal from "../components/Modal/Modal";
import AccountMasterTable from "../components/Admin_components/AccountMasterTable";
import styles from "../styles/AccountMaster.module.css";
const DesignMaster = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEntering, setIsEntering] = useState(true);
    const [disMode, setDisMode] = useState(0);

    const [Dno,setDno] = useState("");
    const [DName, setDName] = useState("");
    const [clothType,setClothType] = useState("");
    const [bcost,setBcost] = useState("");
    const [wcost,setWcost] = useState("");
    const [jcost,setJcost] = useState("");
    const [lcost,setLcost] = useState("");
    const [dcost,setDcost] = useState("");
    const [pcost,setPcost] = useState("");
    const [mu,setMU] = useState("");

    const buttonModes = {
        0: [
            { dis: true, label: "Delete" },
            { dis: false, label: "Add" },
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
            { dis: false, label: "Save" },
            { dis: true, label: "Edit" },
            { dis: false, label: "Cancel" },
            { dis: false, label: "Exit" },
        ],
    };
    const closeHandler = () => {
        setIsOpen(false);
    };
    const addSaveHandler = async (event) => {
        event.preventDefault();
        //code
    };
    const deleteHandler = async () => {
        if (disMode === 1) {
            // axios to delete the data
            // try {
            //     const res = await instance.post("deletedata", data);
            //     if (res.data == 1) {
            //         toast.success("Deleted successfully!", {
            //             style: {
            //                 borderRadius: "15px",
            //                 background: "#333",
            //                 color: "#fff",
            //             },
            //         });
            //     }
            // } catch (err) {
            //     console.log(err);
            // }
            exitHandler();
        }
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
    const exitHandler = () => {
        // return to default screen like on reload
        setDisMode(0);
        setIsEntering(true);
        setDName("");
    };
    const showHandler = (rowdetails) => {
        console.log(rowdetails);
        setDisMode(1);
        setIsEntering(false);
        setIsOpen(false);
        setDName(rowdetails.AccName);
    };
    return (
        <div className={styles["main"]}>
            <h2>Design Master</h2>
            <div className={styles["form-main"]}>
                <form onSubmit={addSaveHandler} className={styles["form"]}>
                    {/* <div className={styles["input-section"]}> */}
                        <input
                            type="number"
                            name="Dno"
                            value={Dno}
                            placeholder="Design Number"
                            onChange={(e) => setDno(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
                        />
                        <input
                            type="text"
                            name="DName"
                            value={DName}
                            placeholder="Design Name"
                            onChange={(e) => setDName(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
                        />
                        <input
                            type="text"
                            name="clothType"
                            value={clothType}
                            placeholder="Cloth Type"
                            onChange={(e) => setClothType(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
                        />
                        <input
                            type="number"
                            name="bcost"
                            value={bcost}
                            placeholder="Basic Cost"
                            onChange={(e) => setBcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
                        />
                        <input
                            type="number"
                            name="wcost"
                            value={wcost}
                            placeholder="Work Cost"
                            onChange={(e) => setWcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
                        />
                        <input
                            type="number"
                            name="lcost"
                            value={lcost}
                            placeholder="Lace Cost"
                            onChange={(e) => setLcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
                        />
                        <input
                            type="number"
                            name="dcost"
                            value={dcost}
                            placeholder="Diamond Cost"
                            onChange={(e) => setDcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
                        />
                        <input
                            type="number"
                            name="pcost"
                            value={pcost}
                            placeholder="Packing Cost"
                            onChange={(e) => setPcost(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
                        />
                        
                    
                    
                    <input
                            type="text"
                            name="clothType"
                            value={clothType}
                            placeholder="Cloth Type"
                            onChange={(e) => setClothType(e.target.value)}
                            disabled={!isEntering}
                            className={`${styles["input-text"]} ${styles["in-top-bar"]}`}
                            required
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
                <AccountMasterTable showclick={showHandler} />
            </Modal>
        </div>
    );
};
export default DesignMaster;
