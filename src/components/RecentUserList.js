// This component renders a list of recent users.

import RecentUser from "./RecentUser";

function RecentUserList(props) {
    // Retrieving values of saved users from localStorage.
    // const firms = localStorage.getItem("savedFirm");
    // const proprietors = localStorage.getItem("savedPro");

    const firms = props.savedFirm;
    const proprietors = props.savedPro;

    return (
        <div className="recent-users">
            {Object.keys(firms).map((key) => {
                return (
                    <RecentUser
                        user={firms[key]}
                        type="firm"
                        key={key}
                        savedClickHandler={props.savedClickHandler}
                    />
                );
            })}
            {Object.keys(proprietors).map((key) => {
                return (
                    <RecentUser
                        user={proprietors[key]}
                        type="proprietor"
                        key={key}
                        savedClickHandler={props.savedClickHandler}
                    />
                );
            })}
        </div>
    );
}

export default RecentUserList;
