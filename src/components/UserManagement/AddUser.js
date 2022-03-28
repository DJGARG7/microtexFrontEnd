import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import AddUserForm from "./AddUserForm";
import axios from "./api/axios";
import commonStyles from "./styles/common.module.css";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

const controller = new AbortController();

export default function AddUser({ userDetails }) {
    const [isLoading, setIsLoading] = useState(true);
    const [permissionsData, setPermissionsData] = useState();

    const fetchData = async () => {
        try {
            const res = await axios.get("../permissions/", {
                signal: controller.signal,
            });
            let temp = [];

            res.data.map((permission) => {
                temp.push({ [permission.p_id]: permission.p_name });
            });

            setPermissionsData(temp);
            setIsLoading(false);
        } catch (error) {
            if (error.name === "AbortError") return;
            toast.error("Error loading user data", toastStyle);
        }
    };

    useEffect(async () => {
        setTimeout(() => {
            fetchData();
        }, 500);

        return () => {
            controller.abort();
        };
    }, []);

    if (isLoading) {
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

    return (
        <div className={commonStyles["main"]}>
            <h2>Add New User</h2>
            <AddUserForm
                corporateID={userDetails.corporateID}
                permissionsData={permissionsData}
            />
        </div>
    );
}
