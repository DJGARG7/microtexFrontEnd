import MainMenu from "./MainMenu";
import AdminContent from "./AdminContent";
// import { useHistory,Prompt } from "react-router-dom";
// import { useState,useEffect } from "react";
import { Fragment } from "react/cjs/react.production.min";
import "../../styles/AdminDashboard.css";

const AdminDashboard = ({ userDetails, logoutHandler }) => {
    // const history = useHistory();
    // const [displayPrompt,setDisplayPrompt] = useState(false);
    // const [locationKeys, setLocationKeys] = useState([]);
    // useEffect(() => {
    //     return history.listen((location) => {
    //         if (history.action === "PUSH") {
    //             setLocationKeys([location.key]);
    //         }
    //         if (history.action === "POP") {
    //             if (locationKeys[1] === location.key) {
    //                 setLocationKeys(([_, ...keys]) => keys);
    // 				setDisplayPrompt(true);
    // 				console.log("forward event at admin");

    //             } else {
    //                 setLocationKeys((keys) => [location.key, ...keys]);
    // 				setDisplayPrompt(true);
    // 				console.log("backward event at admin");

    //             }
    //         }
    //     });
    // }, [locationKeys,displayPrompt]);
    return (
        <Fragment>
            {/* <Prompt when={displayPrompt} message = "Dont use browser back/forward buttons"/> */}
            <div className="body">
                <div className="MainMenu">
                    <MainMenu
                        userDetails={userDetails}
                        logoutHandler={logoutHandler}
                    />
                </div>
                <div className="content">
                    <AdminContent />
                </div>
            </div>
        </Fragment>
    );
};
export default AdminDashboard;
