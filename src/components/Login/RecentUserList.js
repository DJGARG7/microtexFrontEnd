// This component renders a list of recent users.

import RecentUser from "./RecentUser";
import styles from "./styles/RecentUserList.module.css";

function RecentUserList(props) {
    const firms = props.savedFirm;
    const proprietors = props.savedPro;

    // On execution deletes user from state & localStorage.
    const deleteUser = (key, type) => {
        if (type === "firm") {
            delete firms[key];
            localStorage.setItem("savedFirm", JSON.stringify(firms));
            props.setSavedFirm(JSON.parse(localStorage.getItem("savedFirm")));
        } else if (type === "proprietor") {
            delete proprietors[key];
            localStorage.setItem("savedPro", JSON.stringify(proprietors));
            props.setSavedPro(JSON.parse(localStorage.getItem("savedPro")));
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
                            savedClickHandler={props.savedClickHandler}
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
                            savedClickHandler={props.savedProClickHandler}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default RecentUserList;
