const AddressGroup = {
    line1: "text",
    line2: "text",
    line3: "text",
    cityName: "dropD",
    pinCode: "text",
};
const ContactGroup = {
    "Phone No": "text",
    "Mobile No": "text",
    Email: "text",
};
const GstGroup = {
    GSTIN: "text",
    RegDate: "api",
    propName: "api",
    PAN: "api",
    dist: "api",
};
const OBGroup = {
    "Opening Balance": "text",
    CrDr: "dropD",
};
const shares = { "Share %": "number" };
const bankdetail = {};
const transport = {};
const GstCat = { "Gst Category": "dropD" };
const commGrp = ["GstGroup", "AddressGroup", "ContactGroup", "OBGroup"];
const AccountTypeData = {
    none: [],
    "Capital Account": ["shares", "bankdetail", ...commGrp],
    "Cash Account": ["OBGroup"],
    "Sundry Creditors": ["bankdetail", "transport", ...commGrp],
    "Creditors for process": ["bankdetail", "transport", ...commGrp],
    "Creditors For Job": ["bankdetail", "transport", ...commGrp],
    "Creditors for expenses": ["bankdetail", "transport", ...commGrp],
    "Creditors for others": ["bankdetail", ...commGrp],

    "Sundry Debtors": ["bankdetail", "transport", ...commGrp],
    "Debtor for others": ["bankdetail", ...commGrp],

    "P&L Expenses": ["GstCat"],
    "P&L Income": ["GstCat"],

    "Opening Stock": ["OBGroup"],
    "Closing Stock": "",

    "Service Tax": ["OBGroup"],
    "TCS Payable": ["OBGroup"],
    "Goods and service tax": ["OBGroup"],
    "Unsecured Loans": ["bankdetail", ...commGrp],
    "Secured Loans": ["bankdetail", ...commGrp],
    "Bank Cash Credit": ["bankdetail", ...commGrp],
    "Loans from others": ["bankdetail", ...commGrp],

    "TCS Recievable": ["OBGroup"],
    "Bank Account": [...commGrp],
    "Fixed Assets": ["bankdetail", ...commGrp],
    "Loans&Advances": ["bankdetail", ...commGrp],
    Investments: ["bankdetail", ...commGrp],
    "Stock in trade": ["bankdetail", ...commGrp],
    Vehicles: ["bankdetail", ...commGrp],
    "GST Receivable": ["bankdetail", ...commGrp],
};
export default AccountTypeData;
