'use client'

import React, { useRef, useEffect } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const App = () => {
    // Define tasks: (execution time, deadline)
    const tasks = [
        { id: 1, executionTime: 2, deadline: 5, color: "blue" },
        { id: 2, executionTime: 3   , deadline: 5, color: "green" },
        { id: 3, executionTime: 1, deadline: 5, color: "yellow" },
    ];

    // Simulate EDF scheduling
    const scheduleEDF = () => {
        const timeline = [];
        let currentTime = 0;

        while (currentTime < 10) {
            // Find the task with the earliest deadline
            const availableTasks = tasks.filter((task) => task.executionTime > 0);
            if (availableTasks.length === 0) break;

            const nextTask = availableTasks.reduce((prev, curr) =>
                curr.deadline < prev.deadline ? curr : prev
            );

            // Execute the task
            timeline.push({ time: currentTime, task: nextTask.id });
            nextTask.executionTime -= 1;
            currentTime += 1;

            // Check for missed deadlines
            tasks.forEach((task) => {
                if (currentTime > task.deadline && task.executionTime > 0) {
                    task.color = "red"; // Mark as missed deadline
                }
            });
        }

        return timeline;
    };

    const timeline = scheduleEDF();

    // Prepare data for Chart.js
    const chartData = {
        labels: Array.from({ length: 10 }, (_, i) => i + 1), // X-axis labels (time)
        datasets: tasks.map((task) => ({
            label: `Task ${task.id}`,
            data: timeline.map((entry) => (entry.task === task.id ? 1 : 0)), // Y-axis data
            borderColor: task.color,
            borderWidth: 2,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: task.color,
        })),
    };

    // Add deadline markers
    const deadlines = tasks.map((task) => ({
        type: "line",
        xMin: task.deadline,
        xMax: task.deadline,
        borderColor: "red",
        borderWidth: 2,
        borderDash: [5, 5],
    }));

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Task Running",
                },
                min: 0,
                max: 1,
                ticks: {
                    stepSize: 1,
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context:any) => {
                        const taskId = context.dataset.label;
                        return `${taskId} is running`;
                    },
                },
            },
        },
        annotation: {
            annotations: deadlines,
        },
    };

    return (
        <div style={{ width: "80%", margin: "auto" }}>
            <h1>EDF Scheduling</h1>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default App;