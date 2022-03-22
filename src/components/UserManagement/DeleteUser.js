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

export default function DeleteUser() {
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
        fetchData();

        return () => {
            controller.abort();
        };
    }, []);

    const deleteUserHandler = async (event) => {
        event.preventDefault();

        if (selectedUser === "DEFAULT") {
            toast.error("Please select a user to delete", toastStyle);
        } else {
            try {
                const res = await axios.delete(`/${selectedUser}`);
                toast.success(res.data, toastStyle);
            } catch (error) {
                toast.error(error.response.data, toastStyle);
            }

            setSelectedUser("DEFAULT");
            fetchData();
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={commonStyles["main"]}>
            <h2>Delete User</h2>
            <form onSubmit={deleteUserHandler} className={commonStyles["form"]}>
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
                    className={`${commonStyles["form--btn"]} ${commonStyles["form--del-btn"]}`}
                >
                    Delete
                </button>
            </form>
        </div>
    );
}
