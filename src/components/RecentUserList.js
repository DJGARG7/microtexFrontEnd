// This component renders a list of recent users.

import React from "react";
import RecentUser from "./RecentUser";

function RecentUserList(props) {
    // Retrieving values of saved users from localStorage.
    // const firms = localStorage.getItem("savedFirm");
    // const proprietors = localStorage.getItem("savedPro");

    const firms = props.savedFirm;
    const proprietors = props.savedPro;

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
        <div className="recent-users">
            {Object.keys(firms).map((key) => {
                return (
                    <React.Fragment key={key}>
                        <button
                            className="delete-user"
                            onClick={() => deleteUser(key, "firm")}
                        >
                            ✗
                        </button>
                        <RecentUser
                            user={firms[key]}
                            type="firm"
                            key={key}
                            savedClickHandler={props.savedClickHandler}
                        />
                    </React.Fragment>
                );
            })}
            {Object.keys(proprietors).map((key) => {
                return (
                    <React.Fragment key={key}>
                        <button
                            className="delete-user"
                            onClick={() => deleteUser(key, "proprietor")}
                        >
                            ✗
                        </button>
                        <RecentUser
                            user={proprietors[key]}
                            type="proprietor"
                            key={key}
                            savedClickHandler={props.savedProClickHandler}
                        />
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default RecentUserList;
