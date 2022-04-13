import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../../components/UserManagement/styles/common.module.css";
import millstyles from "../../styles/Mill.module.css";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

// Helper function to get the current date.
function convertDate(inputFormat) {
    function pad(s) {
        return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}

export default function SendToMillForm({ accountsData }) {
    // Form binding.
    const [date, setDate] = useState(convertDate(new Date()));
    const [selectedGrey, setSelectedGrey] = useState("DEFAULT");
    const [selectedAccount, setSelectedAccount] = useState("DEFAULT");

    // Form data.
    const [greyItems, setGreyItems] = useState();

    const fetchGreyItems = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3005/userService/fetchGreyBills/${selectedAccount}`
            );

            console.log(res.data);
            setGreyItems(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch grey item data", toastStyle);
        }
    };

    useEffect(() => {
        console.log(selectedAccount);
        fetchGreyItems();
    }, [selectedAccount]);

    const submitHandler = () => {
        console.log("Hello");
    };

    return (
        <form onSubmit={submitHandler} className={millstyles["form"]}>
            <div className={millstyles["form--group"]}>
                <input
                    type="text"
                    onChange={(e) => console.log(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    value={date}
                    placeholder="Date"
                    className={millstyles["form--input"]}
                />
                <input
                    type="text"
                    placeholder="Bill Number"
                    className={millstyles["form--input"]}
                />
                <input
                    type="text"
                    placeholder="Challan Number"
                    className={millstyles["form--input"]}
                />
            </div>

            <div className={millstyles["form--group"]}>
                <select
                    placeholder="Account"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedAccount}
                    onChange={(e) => {
                        setSelectedAccount(e.target.value);
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select account...
                    </option>
                    <option value="hello">Hello</option>
                    {accountsData.map((account) => {
                        return (
                            <option
                                value={account.AccName}
                                key={account.AccName}
                            >
                                {account.AccName}
                            </option>
                        );
                    })}
                </select>

                <select
                    placeholder="Grey cloth"
                    className={`${millstyles["form--input"]} ${millstyles["form--input-select"]}`}
                    value={selectedGrey}
                    onChange={(e) => {
                        setSelectedGrey(e.target.value);
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select cloth...
                    </option>
                    {
                        // Get Grey cloth.
                        /* {users.map((user) => {
                return (
                    <option
                        value={Object.keys(user)[0]}
                        key={Object.keys(user)[0]}
                    >
                        {Object.values(user)[0]}
                    </option>
                );
            })} */
                    }
                </select>
            </div>

            <button
                className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
            >
                Send
            </button>
        </form>
    );
}
