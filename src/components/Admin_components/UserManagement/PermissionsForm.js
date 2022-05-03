import { useEffect, useState } from "react";
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

const controller = new AbortController();

export default function PermissionsForm({ selectedUser, permissionsData }) {
    const [userPermissions, setUserPermissions] = useState();

    const fetchUserPermissions = async () => {
        try {
            const res = await axios.get(`../permissions/${selectedUser}`, {
                // signal: controller.signal,
            });

            let temp = [];

            res.data.map((permission) => {
                temp.push(permission.p_id);
            });

            setUserPermissions(temp);
        } catch (error) {
            if (error.name === "AbortError") return;
            console.log(error);
            toast.error("Error loading user permission data", toastStyle);
        }
    };

    useEffect(() => {
        fetchUserPermissions();

        return () => {
            controller.abort();
        };
    }, [selectedUser]);

    function setCheckboxes() {
        let checkboxes = document.getElementsByName("permissions");

        // Check checkboxes if included in userPermissions.
        for (var i = 0; i < checkboxes.length; i++) {
            if (userPermissions.includes(parseInt(checkboxes[i].value)))
                checkboxes[i].checked = true;
            else checkboxes[i].checked = false;
        }
    }

    const selectPermissionHandler = (event) => {
        if (event.target.checked) {
            const res = axios.post(
                `../permissions/${selectedUser}/${event.target.value}`
            );

            toast.promise(
                res,
                {
                    loading: "Saving...",
                    success: (data) => {
                        return data.data;
                    },
                    error: "Uh oh, there was an error!",
                },
                toastStyle
            );
        } else {
            const res = axios.delete(
                `../permissions/${selectedUser}/${event.target.value}`
            );

            toast.promise(
                res,
                {
                    loading: "Deleting...",
                    success: (data) => {
                        return data.data;
                    },
                    error: "Uh oh, there was an error!",
                },
                toastStyle
            );
        }
    };

    return (
        <div className={commonStyles["form--permissions"]}>
            <h3
                className={commonStyles["form--subtitle"]}
                style={{ marginTop: "2.5vh" }}
            >
                Permissions
            </h3>
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
                        />
                    </div>
                );
            })}
            {setCheckboxes()}
        </div>
    );
}
