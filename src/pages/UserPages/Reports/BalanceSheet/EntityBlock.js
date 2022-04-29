export default function EntityBlock({ data }) {
    const style_main = {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "15px",
        backgroundColor: "#c3bdba",
        borderRadius: "5px",
        marginBottom: "10px",
    };

    const style_heading = {
        textTransform: "uppercase",
        fontSize: "1.25rem",
        fontWeight: "700",
        marginBottom: "10px",
    };

    const style_row = {
        display: "flex",
        width: "100%",
        fontSize: "1.1rem",
        justifyContent: "space-between",
        margin: "5px 0",
    };

    const style_hr = { margin: "10px 0", border: "1px solid black" };

    const style_total = {
        fontSize: "1.1rem",
        alignSelf: "flex-end",
    };

    return (
        <div style={style_main}>
            <div style={style_heading}>{data.heading}</div>
            {data.subdata.map((row) => {
                return (
                    <div style={style_row}>
                        <div>{row.name}</div>
                        <div>{row.value}</div>
                    </div>
                );
            })}
            <hr style={style_hr} />
            <div style={style_total}>{data.total}</div>
        </div>
    );
}
