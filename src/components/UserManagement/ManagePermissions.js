import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactLoading from "react-loading";
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

export default function UserManagementIndex() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("DEFAULT");

    const fetchData = async () => {
        try {
            const res = await axios.get("/", {
                signal: controller.signal,
            });

            let temp = [];

            res.data.map((user) => {
                temp.push({ [user.uuid]: user.user_id });
            });

            setUsers(temp);
            setIsLoading(false);
        } catch (error) {
            if (error.name === "AbortError") return;
            toast.error("Error loading user data", toastStyle);
        }
    };

    useEffect(async () => {
        setTimeout(() => {
            fetchData();
        }, 1000);

        return () => {
            controller.abort();
        };
    }, []);

    const updatePermissionsHandler = async (event) => {
        event.preventDefault();

        if (selectedUser === "DEFAULT") {
            toast.error(
                "Please select a user to update permissions",
                toastStyle
            );
        } else {
            try {
                // const res = await axios.delete(`/${selectedUser}`);
                toast.success("Hello!", toastStyle);
            } catch (error) {
                toast.error(error.response.data, toastStyle);
            }

            setSelectedUser("DEFAULT");
            fetchData();
        }
    };

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
            <h2>Manage User Permissions</h2>
            <form
                onSubmit={updatePermissionsHandler}
                className={commonStyles["form"]}
            >
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
                            <option
                                value={Object.keys(user)[0]}
                                key={Object.keys(user)[0]}
                            >
                                {Object.values(user)[0]}
                            </option>
                        );
                    })}
                </select>

                <button
                    className={`${commonStyles["form--btn"]} ${commonStyles["form--add-btn"]}`}
                >
                    Update
                </button>
            </form>
        </div>
    );
}
