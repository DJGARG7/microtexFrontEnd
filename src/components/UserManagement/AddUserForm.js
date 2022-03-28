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

export default function AddUserForm({ corporateID, permissionsData }) {
    const [userID, setUserID] = useState("");
    const [userName, setUserName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());

    const selectPermissionHandler = (event) => {
        let temp = selectedPermissions;

        if (event.target.checked) {
            setSelectedPermissions(temp.add(parseInt(event.target.value)));
            // console.log(selectedPermissions);
        } else {
            temp.delete(parseInt(event.target.value));
            temp.size === 0
                ? setSelectedPermissions(new Set())
                : setSelectedPermissions(temp);

            // console.log(selectedPermissions);
        }
    };

    const addUserHandler = async (event) => {
        event.preventDefault();

        if (
            document.getElementById("registerPassword").value !==
            document.getElementById("confirmPassword").value
        ) {
            toast.error("Passwords do not match!", toastStyle);
            document.getElementById("registerPassword").value = "";
            document.getElementById("confirmPassword").value = "";
        } else {
            try {
                const res = await axios.post("/", {
                    userType: "firm",
                    corporateID: corporateID,
                    userID: userID,
                    userName: userName,
                    password: document.getElementById("registerPassword").value,
                    isAdmin: false,
                    permissions: Array.from(selectedPermissions),
                });

                toast.success(res.data, toastStyle);

                // Clearing fields.
                setUserID("");
                setUserName("");
                document.getElementById("registerPassword").value = "";
                document.getElementById("confirmPassword").value = "";

                // Clearing checkboxes.
                let checkboxes = document.getElementsByName("permissions");
                for (var i = 0; i < checkboxes.length; i++)
                    checkboxes[i].checked = false;
                setSelectedPermissions(new Set());
            } catch (error) {
                toast.error(error.response.data, toastStyle);
            }
        }
    };

    return (
        <form onSubmit={addUserHandler} className={commonStyles["form"]}>
            <h3 className={commonStyles["form--subtitle"]}>User details</h3>
            <input
                type="text"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={commonStyles["form--inp-t"]}
                id="userName"
                required
            />
            <input
                type="text"
                placeholder="User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                className={commonStyles["form--inp-t"]}
                id="userID"
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
            <h3 className={commonStyles["form--subtitle"]}>Permissions</h3>
            <div className={commonStyles["form--permissions"]}>
                {permissionsData.map((permission) => {
                    return (
                        <div
                            key={Object.keys(permission)[0]}
                            className={commonStyles["form--permission"]}
                        >
                            <label htmlFor={Object.keys(permission)[0]}>
                                {Object.values(permission)[0]}
                            </label>
                            <input
                                type="checkbox"
                                name="permissions"
                                id={Object.keys(permission)[0]}
                                value={Object.keys(permission)[0]}
                                onChange={selectPermissionHandler}
                            />
                        </div>
                    );
                })}
            </div>

            <button
                type="submit"
                className={`${commonStyles["form--btn"]} ${commonStyles["form--add-btn"]}`}
            >
                Add
            </button>
        </form>
    );
}
