import { useState } from "react";
import toast from "react-hot-toast";
import { toastError, toastSuccess } from "../Reuse_components/toast";
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
        } else {
            temp.delete(parseInt(event.target.value));
            temp.size === 0
                ? setSelectedPermissions(new Set())
                : setSelectedPermissions(temp);
        }
    };

    const addUserHandler = async (event) => {
        event.preventDefault();

        if (
            document.getElementById("registerPassword").value !==
            document.getElementById("confirmPassword").value
        ) {
            // Toast if passwords don't match.
            toastError("Passwords do not match!");

            // Clear password fields.
            document.getElementById("registerPassword").value = "";
            document.getElementById("confirmPassword").value = "";
        } else {
            // Send toast to indicate request is being processed.
            const toastID = toast.loading("Registering...", toastStyle);

            try {
                // Send request to backend.
                const res = await axios.post("/", {
                    userType: "firm",
                    corporateID: corporateID,
                    userID: userID,
                    userName: userName,
                    password: document.getElementById("registerPassword").value,
                    isAdmin: false,
                    permissions: Array.from(selectedPermissions),
                });

                // Toast on success.
                setTimeout(() => {
                    toast.success(res.data, { id: toastID });
                }, 500);

                // Clearing fields.
                setUserID("");
                setUserName("");
                document.getElementById("registerPassword").value = "";
                document.getElementById("confirmPassword").value = "";

                // Clearing checkboxes.
                let checkboxes = document.getElementsByName("permissions");
                for (var i = 0; i < checkboxes.length; i++)
                    checkboxes[i].checked = false;

                // Clear the selected permissions state.
                setSelectedPermissions(new Set());
            } catch (error) {
                setTimeout(() => {
                    toast.error(error.response.data, { id: toastID });
                }, 500);
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

            <strong className={commonStyles["form--password-warning"]}>
                ✱ Password must be atleast 8 characters long.
            </strong>

            <h3 className={commonStyles["form--subtitle"]}>Permissions</h3>
            <div className={commonStyles["form--permissions"]}>
                {permissionsData.map((permission) => {
                    return (
                        <div
                            key={permission.p_id}
                            className={commonStyles["form--permission"]}
                        >
                            <label htmlFor={permission.p_id}>
                                {permission.p_name}
                            </label>
                            <input
                                type="checkbox"
                                name="permissions"
                                id={permission.p_id}
                                value={permission.p_id}
                                onChange={selectPermissionHandler}
                                style={{ marginRight: "10px" }}
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
