import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import React from "react";

function DoughnutChart({ labels, data }) {
    const Doughnutdata = {
        labels: labels,
        datasets: [
            {
                label: "My First Dataset",
                data: data,
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(255, 205, 86)",
                    "rgb(0, 255, 0)",
                    "rgb(255,0,0)",
                    "rgb(128,128,128)",
                ],
                hoverOffset: 4,
            },
        ],
        plugins: {
            datalabels: {
                display: true,
                formatter: (val, ctx) => {
                    return ctx.chart.data.labels[ctx.dataIndex];
                },
                color: "#fff",
                backgroundColor: "#404040",
            },
        },
    };
    return (
        <div>
            <Doughnut data={Doughnutdata} width={250} height={250} />
        </div>
    );
}

export default DoughnutChart;
