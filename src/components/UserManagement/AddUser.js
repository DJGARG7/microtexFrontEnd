import { useState } from "react";
import toast from "react-hot-toast";

import axios from "./api/axios";

import commonStyles from "./styles/common.module.css";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

export default function UserManagementIndex({ userDetails }) {
    const [userID, setUserID] = useState();
    const [userName, setUserName] = useState();

    const addUserHandler = async (event) => {
        event.preventDefault();

        if (
            document.getElementById("registerPassword").value !==
            document.getElementById("confirmPassword").value
        )
            toast.error("Passwords do not match!", toastStyle);
        else {
            try {
                const res = await axios.post("/register", {
                    userType: "firm",
                    corporateID: userDetails.corporateID,
                    userID: userID,
                    userName: userName,
                    password: document.getElementById("registerPassword").value,
                    isAdmin: false,
                });

                toast.success(res.data, toastStyle);
            } catch (error) {
                toast.error(error.response.data, toastStyle);
            }
        }
    };

    return (
        <div className={commonStyles["main"]}>
            <h2>Add New User</h2>
            <form onSubmit={addUserHandler} className={commonStyles["form"]}>
                <input
                    type="text"
                    placeholder="User Name"
                    onChange={(e) => setUserName(e.target.value)}
                    className={commonStyles["form--inp-t"]}
                    required
                />
                <input
                    type="text"
                    placeholder="User ID"
                    onChange={(e) => setUserID(e.target.value)}
                    className={commonStyles["form--inp-t"]}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    id="registerPassword"
                    className={commonStyles["form--inp-p"]}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    className={commonStyles["form--inp-p"]}
                    required
                />
                <button
                    type="submit"
                    className={`${commonStyles["form--btn"]} ${commonStyles["form--add-btn"]}`}
                >
                    Add
                </button>
            </form>
        </div>
    );
}
