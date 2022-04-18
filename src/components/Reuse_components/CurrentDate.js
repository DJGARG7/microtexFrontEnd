const current = new Date();
const CurrentDate = () => {
    const currDate = [
        current.getFullYear(),
        ("0" + (current.getMonth() + 1)).slice(-2),
        ("0" + (current.getDate() + 1)).slice(-2),
    ].join("-");
    return currDate;
};
export default CurrentDate;
