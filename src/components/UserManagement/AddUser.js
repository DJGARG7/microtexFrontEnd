import { useState } from "react";
import toast from "react-hot-toast";
import commonStyles from "./styles/common.module.css";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

export default function UserManagementIndex() {
    const [userName, setUserName] = useState();

    const addUserHandler = (event) => {
        event.preventDefault();
        try {
            // Backend request.
            toast.success("User added successfully!", toastStyle);
        } catch (error) {
            toast.error(error, toastStyle);
        }
    };

    return (
        <div className={commonStyles["main"]}>
            <h2>Add New User</h2>
            <form onSubmit={addUserHandler} className={commonStyles["form"]}>
                <input
                    type="text"
                    placeholder="User ID"
                    onChange={(e) => setUserName(e.target.value)}
                    className={commonStyles["form--inp-t"]}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={commonStyles["form--inp-p"]}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className={commonStyles["form--inp-p"]}
                />
                <button
                    className={`${commonStyles["form--btn"]} ${commonStyles["form--add-btn"]}`}
                >
                    Add
                </button>
            </form>
        </div>
    );
}
