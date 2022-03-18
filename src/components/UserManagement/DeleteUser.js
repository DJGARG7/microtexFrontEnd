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

export default function DeleteUser() {
    const [userName, setUserName] = useState();

    const deleteUserHandler = (event) => {
        event.preventDefault();
        try {
            // Backend request.
            toast.success("User deleted successfully!", toastStyle);
        } catch (error) {
            toast.error(error, toastStyle);
        }
    };

    return (
        <div className={commonStyles["main"]}>
            <h2>Delete User</h2>
            <form onSubmit={deleteUserHandler} className={commonStyles["form"]}>
                <input
                    type="text"
                    placeholder="User ID"
                    onChange={(e) => setUserName(e.target.value)}
                    className={commonStyles["form--inp-t"]}
                />
                <button
                    className={`${commonStyles["form--btn"]} ${commonStyles["form--del-btn"]}`}
                >
                    Delete
                </button>
            </form>
        </div>
    );
}
