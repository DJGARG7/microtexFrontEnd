// This component renders a card for a recent user.

import styles from "./styles/RecentUser.module.css";

function RecentUser(props) {
    // On execution autofills the form inputs.
    const clickHandler = () => {
        if (props.type === "firm")
            props.savedUserHandler(props.user.c_id, props.user.u_id);
        else props.savedUserHandler(props.user.u_id);
    };

    return (
        <button
            className={[styles["recent-user"], styles[props.type]].join(" ")}
            onClick={clickHandler}
        >
            <div className="name">{props.user.name}</div>
            {props.type === "firm" ? (
                <div className={styles[`${props.type}-id`]}>
                    <div>{props.user.c_id}</div>
                    <div>{props.user.u_id}</div>
                </div>
            ) : (
                <div className={styles[`${props.type}-id`]}>
                    <div>{props.user.u_id}</div>
                </div>
            )}
        </button>
    );
}

export default RecentUser;
