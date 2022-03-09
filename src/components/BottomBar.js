import { useEffect, useState } from "react";

export default function BottomBar() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        setInterval(() => {
            setTime(new Date());
        }, 60000);
    }, [time]);

    return (
        <div className="navbar">
            <a className="active">support@microtex.in</a>
            <a>Contact: 1800 5654 7868</a>
            <a>{time.toLocaleDateString()}</a>
            {/* <a>{time.toLocaleTimeString()}</a> */}
        </div>
    );
}
