import toast from "react-hot-toast";

const toastError = (message) => {
    toast.error(message, {
        style: {
            borderRadius: "15px",
            background: "#333",
            color: "#fff",
        },
    });
};
export default toastError;
