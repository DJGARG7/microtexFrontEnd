import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
import axios from "./api/axios";
import PermissionsForm from "./PermissionsForm";
import commonStyles from "./styles/common.module.css";

const toastStyle = {
    style: {
        borderRadius: "15px",
        background: "#333",
        color: "#fff",
    },
};

const controller = new AbortController();

export default function UserManagementIndex() {
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [isPermissionsLoading, setIsPermissionsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("DEFAULT");
    const [permissionsData, setPermissionsData] = useState();

    const fetchUsers = async () => {
        try {
            const res = await axios.get("/", {
                // signal: controller.signal,
            });

            setUsers(res.data);
            setIsUsersLoading(false);
        } catch (error) {
            // if (error.name === "AbortError") return;
            toast.error("Error loading user data", toastStyle);
        }
    };

    const fetchPermissions = async () => {
        try {
            const res = await axios.get("../permissions/", {
                // signal: controller.signal,
            });

            setPermissionsData(res.data);
            setIsPermissionsLoading(false);
        } catch (error) {
            // if (error.name === "AbortError") return;
            toast.error("Error loading permission data", toastStyle);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchUsers();
            fetchPermissions();
        }, 500);

        return () => {
            controller.abort();
        };
    }, []);

    if (isUsersLoading || isPermissionsLoading) {
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
            <h2>Manage User Permissions</h2>
            <form className={commonStyles["form"]}>
                <select
                    placeholder="User ID"
                    className={commonStyles["form--inp-s"]}
                    value={selectedUser}
                    onChange={(e) => {
                        setSelectedUser(e.target.value);
                    }}
                >
                    <option disabled hidden value="DEFAULT">
                        Select user...
                    </option>
                    {users.map((user) => {
                        return (
                            <option value={user.uuid} key={user.uuid}>
                                {user.user_id}
                            </option>
                        );
                    })}
                </select>

                {selectedUser !== "DEFAULT" && (
                    <PermissionsForm
                        selectedUser={selectedUser}
                        permissionsData={permissionsData}
                    />
                )}
            </form>
        </div>
    );
}
