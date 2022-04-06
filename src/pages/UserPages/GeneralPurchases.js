import React, { useEffect, useState } from "react";
import axios from "axios";

function GeneralPurchases({ userDetails }) {
    const [isAllowed, setIsAllowed] = useState(false);

    const checkPermission = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3002/permissions/${userDetails.uuid}/2`
            );

            setIsAllowed(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkPermission();
    }, []);

    if (!isAllowed) {
        return (
            <div
                style={{
                    marginTop: "10vh",
                }}
            >
                <strong>You are not allowed access to this area.</strong>
            </div>
        );
    }

    return (
        <div>
            <h1>General Purchases</h1>
        </div>
    );
}

export default GeneralPurchases;
