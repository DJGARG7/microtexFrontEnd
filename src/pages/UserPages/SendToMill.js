import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import axios from "axios";
import styles from "../../components/UserManagement/styles/common.module.css";
import SendToMillForm from "./SendToMillForm";

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

export default function SendToMill({ userDetails }) {
    // Authorization state.
    const [isAllowed, setIsAllowed] = useState(false);

    // Loading states.
    const [isAllowedLoading, setIsAllowedLoading] = useState(true);
    const [isAccountsLoading, setIsAccountsLoading] = useState(true);

    // Form data.
    const [accounts, setAccounts] = useState();

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/3`
            );

            setIsAllowed(res.data);
            setIsAllowedLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAccounts = async (accountType) => {
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
        fetchAccounts("Sundry Creditors");
    }, []);

    if (isAllowedLoading || isAccountsLoading) {
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
            <h2>Send to Mill</h2>
            <SendToMillForm accountsData={accounts} />
        </div>
    );
}
