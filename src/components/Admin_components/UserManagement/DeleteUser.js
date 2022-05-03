import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "../../Reuse_components/toast";
import ReactLoading from "react-loading";
import axios from "./api/axios";
import commonStyles from "./styles/common.module.css";

const controller = new AbortController();

export default function DeleteUser() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("DEFAULT");

    const fetchData = async () => {
        try {
            const res = await axios.get("/", {
                // signal: controller.signal,
            });

            setUsers(res.data);
            setIsLoading(false);
        } catch (error) {
            // if (error.name === "AbortError") return;
            toastError("Error loading user data");
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 500);

        return () => {
            controller.abort();
        };
    }, []);

    const deleteUserHandler = async (event) => {
        event.preventDefault();

        if (selectedUser === "DEFAULT") {
            toastError("Please select a user to delete");
        } else {
            try {
                const res = await axios.delete(`/${selectedUser}`);
                toastSuccess(res.data);
            } catch (error) {
                toastError(error.response.data);
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
                            <option value={user.uuid} key={user.uuid}>
                                {user.user_id}
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
