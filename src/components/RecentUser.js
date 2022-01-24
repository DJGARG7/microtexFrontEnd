// This component renders a card for a recent user.

function RecentUser(props) {
    const clickHandler = () => {
        if (props.type === "firm")
            props.savedClickHandler(props.user.c_id, props.user.u_id);
        else props.savedClickHandler(props.user.u_id);
    };

    return (
        <div className="recent-user">
            <button
                className={`recent-user__${props.type}`}
                onClick={clickHandler}
            >
                <div className="name">{props.user.name}</div>
                {props.type === "firm" ? (
                    <div className={`${props.type}-id`}>
                        <div>{props.user.c_id}</div>
                        <div>{props.user.u_id}</div>
                    </div>
                ) : (
                    <div className={`${props.type}-id`}>
                        <div>{props.user.u_id}</div>
                    </div>
                )}
            </button>
        </div>
    );
}

export default RecentUser;
