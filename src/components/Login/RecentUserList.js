// This component renders a list of recent users.

import React, { useState } from "react";
import RecentUser from "./RecentUser";
import styles from "./styles/RecentUserList.module.css";

function RecentUserList(props) {
    // For persisting recent users.
    localStorage.getItem("savedFirms") === null &&
        localStorage.setItem("savedFirms", JSON.stringify({}));

    localStorage.getItem("savedProprietors") === null &&
        localStorage.setItem("savedProprietors", JSON.stringify({}));

    // Saving recent users from local storage as current state.
    const [firms, saveFirm] = useState(
        JSON.parse(localStorage.getItem("savedFirms"))
    );
    const [proprietors, saveProprietor] = useState(
        JSON.parse(localStorage.getItem("savedProprietors"))
    );

    // On execution deletes user from state & localStorage.
    const deleteUser = (key, type) => {
        if (type === "firm") {
            delete firms[key];
            localStorage.setItem("savedFirms", JSON.stringify(firms));
            saveFirm(JSON.parse(localStorage.getItem("savedFirms")));
        } else if (type === "proprietor") {
            delete proprietors[key];
            localStorage.setItem(
                "savedProprietors",
                JSON.stringify(proprietors)
            );
            saveProprietor(
                JSON.parse(localStorage.getItem("savedProprietors"))
            );
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
