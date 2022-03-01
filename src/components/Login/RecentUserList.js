// This component renders a list of recent users.

import React, { useState } from "react";
import RecentUser from "./RecentUser";
import styles from "./styles/RecentUserList.module.css";

function RecentUserList(props) {
    // Saving recent users from local storage as current state.
    const [firms, saveFirm] = useState(
        JSON.parse(localStorage.getItem("savedFirm"))
    );
    const [proprietors, saveProprietor] = useState(
        JSON.parse(localStorage.getItem("savedPro"))
    );

    // On execution deletes user from state & localStorage.
    const deleteUser = (key, type) => {
        if (type === "firm") {
            delete firms[key];
            localStorage.setItem("savedFirm", JSON.stringify(firms));
            saveFirm(JSON.parse(localStorage.getItem("savedFirm")));
        } else if (type === "proprietor") {
            delete proprietors[key];
            localStorage.setItem("savedPro", JSON.stringify(proprietors));
            saveProprietor(JSON.parse(localStorage.getItem("savedPro")));
        }
    };

    return (
        <div className={styles["recent-users"]}>
            {Object.keys(firms).map((key) => {
                return (
                    <div className={styles["recent-user"]} key={key}>
                        <button
                            className={styles["delete-user"]}
                            onClick={() => deleteUser(key, "firm")}
                        >
                            <strong>✗</strong>
                        </button>
                        <RecentUser
                            user={firms[key]}
                            type="firm"
                            key={key}
                            savedUserHandler={props.savedFirmHandler}
                        />
                    </div>
                );
            })}
            {Object.keys(proprietors).map((key) => {
                return (
                    <div className={styles["recent-user"]} key={key}>
                        <button
                            className={styles["delete-user"]}
                            onClick={() => deleteUser(key, "proprietor")}
                        >
                            <strong>✗</strong>
                        </button>
                        <RecentUser
                            user={proprietors[key]}
                            type="proprietor"
                            key={key}
                            savedUserHandler={props.savedProprietorHandler}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default RecentUserList;
