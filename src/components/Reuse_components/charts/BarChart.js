import { Bar } from "react-chartjs-2";
import React from "react";

function BarChart({ chartData }) {

    const chartdata = {
        labels: chartData.labels,
        datasets: [
            {
                label: "",
                data: chartData.data,
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                    "rgb(0, 255, 0)",
                ],
                borderColor: "black",
                borderWidth: 2,
            },
        ],
    };
    return (
        <Bar
            data={chartdata}
        />
    );
}

export default BarChart;
