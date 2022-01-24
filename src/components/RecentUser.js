// This component renders a card for a recent user.

function RecentUser(props) {
    // console.log(props);

    return (
        <div className="recent-user">
            <button className="delete-user">✗</button>
            <button
                className={`recent-user__${props.type}`}
                onClick={() => {
                    if (props.type === "firm")
                        props.savedClickHandler(
                            props.user.c_id,
                            props.user.u_id
                        );
                    else
                        props.savedClickHandler(
                            props.user.c_id,
                            props.user.u_id
                        );
                }}
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
