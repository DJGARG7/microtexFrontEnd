import { useState } from "react";
import Select from "react-dropdown-select";
import AccountTypeData from "../jsonData/AccountTypeData";
const AccountMaster = () => {
    const [isEntering, setIsEntering] = useState(false);
    const [accName,setAccName] = useState("");
    return (
        <div>
            <h1>This is Account Master</h1>
            <form>
                <input
                    type="text"
                    name="Acc_name"
                    value={accName}
                    placeholder="Account Name"
                    onChange={(e) => setAccName(e.target.value)}
                    required
                />
                <Select options={[{label:"a"},{label:"b"}]}/>
                <input
                    type="text"
                    name="Acc_name"
                    value={accName}
                    placeholder="Account Name"
                    onChange={(e) => setAccName(e.target.value)}
                    required
                />
            </form>
        </div>
    );
};
export default AccountMaster;
