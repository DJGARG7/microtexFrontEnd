import { useState } from "react";
import AccountTypeData from "../jsonData/AccountTypeData";
const AccountMaster = ({ c_id }) => {
    const [isEntering, setIsEntering] = useState(true);
    const [accName, setAccName] = useState("");
    const [accType, setType] = useState("none");
    const [addline1, setAddLine1] = useState("");
    const [addline2, setAddLine2] = useState("");
    const [addline3, setAddLine3] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [city, setCity] = useState("");
    const [boolList, setBoolList] = useState([]);
    const [disMode, setDisMode] = useState(0);
    const buttonModes = {
        0: [
            { dis: true, label: "delete" },
            { dis: false, label: "add" },
            { dis: false, label: "view all data" },
            { dis: true, label: "cancel" },
            { dis: false, label: "exit" },
        ],
        1: [
            { dis: false, label: "delete" },
            { dis: true, label: "add" },
            { dis: false, label: "edit" },
            { dis: true, label: "cancel" },
            { dis: false, label: "exit" },
        ],
        2: [
            { dis: true, label: "delete" },
            { dis: false, label: "save" },
            { dis: true, label: "edit" },
            { dis: false, label: "cancel" },
            { dis: false, label: "exit" },
        ],
    };
    //from city service in useeffect
    const CityData = ["Surat", "Delhi", "Mumbai", "Ahmedabad"];
    const submitHandler = (e) => {
        e.preventDefault();
        console.log(accName);
        console.log(accType);
        console.log(boolList);
    };
    const changeHandler = (e) => {
        setBoolList(AccountTypeData[e.target.value]);
        setType(e.target.value);
    };
    const cityHandler = (e) => {
        setCity(e.target.value);
    };
    const deleteHandler = () => {
        if (disMode == 1) {
            // delete from database after confirming
            console.log("deleted from database");
            exitHandler();
        }
    };
    const addSaveHandler = () => {
        if (disMode == 0) {
            // add to database
            console.log("data added to db");
        }
        if (disMode == 2) {
            // update to database
            console.log("data updated to db");
        }
        setDisMode(1);
        setIsEntering(false);
    };
    const editViewHandler = () => {
        if (disMode == 0) {
            // select * all data in modal
            console.log("data displayed in modal");
        }
        if (disMode == 1) {
            setDisMode(2);
            setIsEntering(true);
        }
    };
    const cancelHandler = () => {
        if (disMode == 2) {
            setDisMode(1);
            //reset the values fetched from database
            setIsEntering(false);
        }
    };
    const exitHandler = () => {
        // return to default screen like on reload
        setDisMode(0);
        setType("none");
        setBoolList([]);
        setIsEntering(true);
    };
    return (
        <div>
            <h1>This is Account Master</h1>
            <form onSubmit={submitHandler}>
                <input
                    type="text"
                    name="AccName"
                    value={accName}
                    placeholder="Account Name"
                    onChange={(e) => setAccName(e.target.value)}
                    disabled={!isEntering}
                    required
                />
                <select
                    name="AccType"
                    value={accType}
                    onChange={changeHandler}
                    disabled={!isEntering}
                >
                    <option value="none" selected disabled hidden>
                        Select AccType
                    </option>
                    {Object.keys(AccountTypeData).map((key1) => {
                        return <option value={key1}>{key1}</option>;
                    })}
                </select>
                {boolList.includes("AddressGroup") && (
                    <div>
                        <input
                            type="text"
                            name="addline1"
                            value={addline1}
                            placeholder="Address line1"
                            onChange={(e) => setAddLine1(e.target.value)}
                            required
                            disabled={!isEntering}
                        />
                        <input
                            type="text"
                            name="addline2"
                            value={addline2}
                            placeholder="Address line2"
                            onChange={(e) => setAddLine2(e.target.value)}
                            required
                            disabled={!isEntering}
                        />
                        <input
                            type="text"
                            name="addline2"
                            value={addline3}
                            placeholder="Address line3"
                            onChange={(e) => setAddLine3(e.target.value)}
                            required
                            disabled={!isEntering}
                        />
                        <select
                            name="cityName"
                            value={city}
                            onChange={cityHandler}
                            disabled={!isEntering}
                        >
                            <option value="none" selected disabled hidden>
                                Select City
                            </option>
                            {CityData.map((city) => {
                                return <option value={city}>{city}</option>;
                            })}
                        </select>
                        <input
                            type="number"
                            name="pincode"
                            value={pinCode}
                            placeholder="pincode"
                            onChange={(e) => setPinCode(e.target.value)}
                            min={100000}
                            max={999999}
                            required
                            disabled={!isEntering}
                        />
                    </div>
                )}
                {boolList.includes("ContactGroup") && <p>ContactGroup</p>}
                {boolList.includes("GstGroup") && <p>GstGroup</p>}
                {boolList.includes("transport") && <p>transport</p>}
                {boolList.includes("OBGroup") && <p>OBGroup</p>}
                {boolList.includes("bankdetail") && <p>bankdetail</p>}
                {boolList.includes("GstCat") && <p>GstCat</p>}
                {boolList.includes("shares") && <p>shares</p>}

                <button>a</button>
            </form>
            <button
                disabled={buttonModes[disMode][0].dis}
                onClick={deleteHandler}
            >
                {buttonModes[disMode][0].label}
            </button>
            <button
                disabled={buttonModes[disMode][1].dis}
                onClick={addSaveHandler}
            >
                {buttonModes[disMode][1].label}
            </button>
            <button
                disabled={buttonModes[disMode][2].dis}
                onClick={editViewHandler}
            >
                {buttonModes[disMode][2].label}
            </button>
            <button
                disabled={buttonModes[disMode][3].dis}
                onClick={cancelHandler}
            >
                {buttonModes[disMode][3].label}
            </button>
            <button
                disabled={buttonModes[disMode][4].dis}
                onClick={exitHandler}
            >
                {buttonModes[disMode][4].label}
            </button>
        </div>
    );
};
export default AccountMaster;
