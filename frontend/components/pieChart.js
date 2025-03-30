"use client"; // Required for client-side components in Next.js

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PieChart() {
    const [chartData, setChartData] = useState(null);
    
    useEffect(() => {
        fetch("/data.json") // Ensure the JSON file is placed in the public folder
            .then((response) => response.json())
            .then((data) => {
                setChartData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: data.dataset.label,
                            data: data.dataset.data,
                            backgroundColor: data.dataset.backgroundColor,
                            borderColor: data.dataset.borderColor,
                            borderWidth: data.dataset.borderWidth,
                        },
                    ],
                });
            })
            .catch((error) => console.error("Error loading JSON data:", error));
    }, []);

    if (!chartData) return <p>Loading chart...</p>;

    const options = {
        plugins: {
            legend: {
                display: false, // Hide legend
            },
            datalabels: {
                color: "white",
                font: {
                    weight: "bold",
                    size: 14,
                },
                anchor: "center",
                align: "center",
                formatter: (value, context) => {
                    return context.chart.data.labels[context.dataIndex];
                },
            },
        },
    };

    return <Pie data={chartData} options={options} />;
}
