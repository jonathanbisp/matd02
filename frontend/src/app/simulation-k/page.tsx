'use client'

import React from "react";
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation"; // Import annotation plugin

// Register Chart.js components
Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, annotationPlugin);

// Function to calculate the least common multiple (LCM) of two numbers
const lcm = (a, b) => {
    const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
    return (a * b) / gcd(a, b);
};

// Function to calculate the hyperperiod (LCM of all task deadlines)
const calculateHyperperiod = (tasks) => {
    return tasks.map((task) => task.deadline).reduce((acc, deadline) => lcm(acc, deadline), 1);
};

const App = () => {
    // Define tasks: (execution time, deadline)
    const tasks = [
        { id: 1, executionTime: 2, deadline: 5, color: "blue" },
        { id: 2, executionTime: 1, deadline: 15, color: "green" },
        { id: 4, executionTime: 1, deadline: 3, color: "pink" },
    ];

    // Calculate hyperperiod
    const hyperperiod = calculateHyperperiod(tasks);

    // Simulate EDF scheduling until hyperperiod
    const scheduleEDF = () => {
        const timeline = [];
        let currentTime = 0;

        // Reset task execution times for each period
        const resetTasks = () => {
            tasks.forEach((task) => {
                task.remainingTime = task.executionTime;
                task.missedDeadline = false;
            });
        };

        resetTasks(); // Initialize tasks

        while (currentTime < hyperperiod) {
            // Find the task with the earliest deadline
            const availableTasks = tasks.filter((task) => task.remainingTime > 0);
            if (availableTasks.length === 0) {
                // Reset tasks for the next period
                resetTasks();
                continue;
            }

            const nextTask = availableTasks.reduce((prev, curr) =>
                curr.deadline < prev.deadline ? curr : prev
            );

            // Execute the task
            timeline.push({ time: currentTime, task: nextTask.id });
            nextTask.remainingTime -= 1;
            currentTime += 1;

            // Check for missed deadlines
            tasks.forEach((task) => {
                if (currentTime % task.deadline === 0 && task.remainingTime > 0) {
                    task.missedDeadline = true; // Mark as missed deadline
                }
            });
        }

        return timeline;
    };

    const timeline = scheduleEDF();

    // Prepare data for Chart.js
    const chartData = {
        labels: Array.from({ length: hyperperiod }, (_, i) => i + 1), // X-axis labels (time)
        datasets: tasks.map((task) => ({
            label: `Task ${task.id}`,
            data: timeline.map((entry) => (entry.task === task.id ? 0.2 : 0)), // Y-axis data
            backgroundColor: timeline.map((entry) =>
                entry.task === task.id ? task.color : "transparent"
            ),
            borderColor: timeline.map((entry) =>
                entry.task === task.id && task.missedDeadline ? "red" : task.color
            ),
            borderWidth: 2,
        })),
    };

    // Add deadline markers
    const deadlines = tasks.flatMap((task) => {
        const deadlines = [];
        for (let time = task.deadline; time <= hyperperiod; time += task.deadline) {
            deadlines.push({
                type: "line",
                xMin: time - 0.5, // Adjust for bar chart alignment
                xMax: time - 0.5,
                borderColor: "red",
                borderWidth: 2,
                borderDash: [5, 5],
            });
        }
        return deadlines;
    });

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
                    label: (context) => {
                        const taskId = context.dataset.label;
                        return `${taskId} is running`;
                    },
                },
            },
            annotation: {
                annotations: deadlines,
            },
        },
    };

    return (
        <div style={{ width: "80%", margin: "auto" }}>
            <h1>EDF Scheduling (Bar Chart)</h1>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default App;