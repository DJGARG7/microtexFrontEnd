import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import axios from "axios";
import styles from "../../../components/UserManagement/styles/common.module.css";

// Axios default configuration to include cookie and user ID with every request.
axios.defaults.withCredentials = true;
axios.defaults.headers.common["userID"] = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails")).userID
    : "";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

export default function ReceiveFromMill({ userDetails }) {
    // Authorization state.
    const [isAllowed, setIsAllowed] = useState(false);

    // Loading states.
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isMillLoading, setIsMillLoading] = useState(true);
    const [isAccountsLoading, setIsAccountsLoading] = useState(true);

    // Form-related data.
    const [accounts, setAccounts] = useState();

    // Form binding.
    const [selectedMill, setSelectedMill] = useState("DEFAULT");
    const [selectedAccount, setSelectedAccount] = useState("DEFAULT");

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/4`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchMillCloth = async () => {
        // Get grey cloth.
        setIsMillLoading(false);
    };

    const fetchAccounts = async () => {
        let accountType = "Creditors for process";

        try {
            const res = await axios.get(
                `http://localhost:3003/accountMaster/${accountType}`
            );

            setAccounts(res.data);
            setIsAccountsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch account data", toastStyle);
        }
    };

    useEffect(() => {
        checkPermission();
        fetchMillCloth();
        fetchAccounts();
    }, []);

    const submitHandler = () => {
        console.log("Hello");
    };

    if (isAllowedLoading || isMillLoading || isAccountsLoading) {
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
        <div className={styles["main"]}>
            <h2>Receive from Mill</h2>
            <form onSubmit={submitHandler} className={styles["form"]}>
                <select
                    placeholder="Mill cloth"
                    className={styles["form--inp-s"]}
                    value={selectedMill}
                    onChange={(e) => {
                        setSelectedMill(e.target.value);
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select mill cloth...
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

                <select
                    placeholder="Account"
                    className={styles["form--inp-s"]}
                    value={selectedAccount}
                    onChange={(e) => {
                        setSelectedAccount(e.target.value);
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select account...
                    </option>

                    {accounts.map((account) => {
                        return (
                            <option value={account.uid} key={account.AccName}>
                                {account.AccName}
                            </option>
                        );
                    })}
                </select>

                <button
                    className={`${styles["form--btn"]} ${styles["form--add-btn"]}`}
                >
                    Receive
                </button>
            </form>
        </div>
    );
}
