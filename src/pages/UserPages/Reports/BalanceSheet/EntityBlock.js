export default function EntityBlock({ data, setSum }) {
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

    let sum = 0.0;

    return (
        <div style={style_main}>
            <div style={style_heading}>{data.heading}</div>
            {data.subdata.map((row, index) => {
                sum += row.value;
                setSum(sum);
                return (
                    <div style={style_row} key={index}>
                        <div>{row.name}</div>
                        <div>{row.value}</div>
                    </div>
                );
            })}
            {setSum(sum)}
            <hr style={style_hr} />
            <div style={style_total}>{sum}</div>
        </div>
    );
}
