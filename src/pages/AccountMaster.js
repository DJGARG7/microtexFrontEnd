import { useState } from "react";
import AccountTypeData from "../jsonData/AccountTypeData";
const AccountMaster = () => {
    const [isEntering, setIsEntering] = useState(false);
    const [accName, setAccName] = useState("");
    const [accType, setType] = useState("none");
    const [boolList, setBoolList] = useState([]);
    const submitHandler = (e) => {
        e.preventDefault();
        console.log(accName);
        console.log(accType);
        console.log(boolList)
    };
    const changeHandler = (e) => {
        setBoolList(AccountTypeData[e.target.value])
        setType(e.target.value);
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
                    required
                />
                <select name="AccType" value={accType} onChange={changeHandler}>
                    <option value="none" selected disabled hidden>
                        Select AccType
                    </option>
                    {Object.keys(AccountTypeData).map((key1) => {
                        return <option value={key1}>{key1}</option>;
                    })}
                </select>
                {boolList.includes("AddressGroup") && <p>AddressGroup</p>}
                {boolList.includes("ContactGroup") && <p>ContactGroup</p>}
                {boolList.includes("GstGroup") && <p>GstGroup</p>}
                {boolList.includes("transport") && <p>transport</p>}
                {boolList.includes("OBGroup") && <p>OBGroup</p>}
                {boolList.includes("bankdetail") && <p>bankdetail</p>}
                {boolList.includes("GstCat") && <p>GstCat</p>}
                {boolList.includes("shares") && <p>shares</p>}


                <button>a</button>
            </form>
        </div>
    );
};
export default AccountMaster;
