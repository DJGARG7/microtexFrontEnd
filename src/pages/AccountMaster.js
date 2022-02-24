import { useState } from "react";
import AccountTypeData from "../jsonData/AccountTypeData";
import styles from "../styles/AccountMaster.module.css";

const AccountMaster = () => {
    const [isEntering, setIsEntering] = useState(false);
    const [accName, setAccName] = useState("");
    const [accType, setType] = useState("none");
    const [addline1, setAddLine1] = useState("");
    const [addline2, setAddLine2] = useState("");
    const [addline3, setAddLine3] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [city, setCity] = useState("");
    const [boolList, setBoolList] = useState([]);

    //from database in useeffect
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

    return (
        <div className={styles["main"]}>
            <h2 className={styles["title"]}>This is Account Master</h2>

            <form onSubmit={submitHandler} className={styles["form"]}>
                <div className={styles["input-section"]}>
                    <input
                        type="text"
                        name="AccName"
                        value={accName}
                        placeholder="Account Name"
                        onChange={(e) => setAccName(e.target.value)}
                        required
                    />
                    <select
                        name="AccType"
                        value={accType}
                        onChange={changeHandler}
                    >
                        <option value="none" selected disabled hidden>
                            Select AccType
                        </option>
                        {Object.keys(AccountTypeData).map((key1) => {
                            return <option value={key1}>{key1}</option>;
                        })}
                    </select>
                </div>

                <div className={styles["input-grid"]}>
                    {boolList.includes("AddressGroup") && (
                        <div className={styles["input-group"]}>
                            <input
                                type="text"
                                name="addline1"
                                value={addline1}
                                placeholder="Address line1"
                                onChange={(e) => setAddLine1(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                name="addline2"
                                value={addline2}
                                placeholder="Address line2"
                                onChange={(e) => setAddLine2(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                name="addline2"
                                value={addline3}
                                placeholder="Address line3"
                                onChange={(e) => setAddLine3(e.target.value)}
                                required
                            />
                            <select
                                name="cityName"
                                value={city}
                                onChange={cityHandler}
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
                </div>

                <button>a</button>
            </form>
        </div>
    );
};
export default AccountMaster;
