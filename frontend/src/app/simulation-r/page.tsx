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
        { id: 1, executionTime: 1, deadline: 4, color: "blue" },
        { id: 2, executionTime: 2, deadline: 6, color: "green" },
        { id: 4, executionTime: 3, deadline: 12, color: "pink" },
    ];

    // Sort tasks by deadline (shortest deadline first for RMS)
    tasks.sort((a, b) => a.deadline - b.deadline);

    // Calculate hyperperiod
    const hyperperiod = calculateHyperperiod(tasks);

    // Simulate Rate Monotonic Scheduling until hyperperiod
    const scheduleRMS = () => {
        const timeline = Array(hyperperiod).fill(null); // Initialize timeline with null values
        let currentTime = 0;

        // Initialize task state
        tasks.forEach((task) => {
            task.remainingTime = task.executionTime;
            task.currentDeadline = task.deadline; // Track the current deadline period
        });

        while (currentTime < hyperperiod) {
            // Find all tasks that are ready to run (remaining execution time and within deadline)
            const availableTasks = tasks.filter(
                (task) => task.remainingTime > 0 && currentTime < task.currentDeadline
            );

            if (availableTasks.length === 0) {
                // No tasks are available to run at this time
                currentTime += 1;
                continue;
            }

            // Select the task with the highest priority (shortest deadline)
            const nextTask = availableTasks[0];

            // Check if the current execution is after the task's current deadline
            const isExecutionLate = currentTime >= nextTask.currentDeadline;

            // Execute the task
            timeline[currentTime] = { task: nextTask.id, isLate: isExecutionLate };
            nextTask.remainingTime -= 1;
            currentTime += 1;

            // If the task has completed its executions for the current period, reset it
            if (nextTask.remainingTime === 0) {
                nextTask.remainingTime = nextTask.executionTime;
                nextTask.currentDeadline += nextTask.deadline; // Move to the next deadline period
            }
        }

        return timeline;
    };

    const timeline = scheduleRMS();

    // Prepare data for Chart.js
    const chartData = {
        labels: Array.from({ length: hyperperiod }, (_, i) => i + 1), // X-axis labels (time)
        datasets: tasks.map((task) => ({
            label: `Task ${task.id}`,
            data: timeline.map((entry) => (entry?.task === task.id ? 1 : 0)), // Y-axis data
            backgroundColor: timeline.map((entry) =>
                entry?.task === task.id && entry.isLate ? "red" : task.color
            ),
            borderColor: timeline.map((entry) =>
                entry?.task === task.id && entry.isLate ? "red" : task.color
            ),
            borderWidth: 2,
        })),
    };

    // Add deadline markers with task-specific colors
    const deadlines = tasks.flatMap((task) => {
        const deadlines = [];
        for (let time = task.deadline; time <= hyperperiod; time += task.deadline) {
            deadlines.push({
                type: "line",
                xMin: time - 0.5, // Adjust for bar chart alignment
                xMax: time - 0.5,
                borderColor: task.color, // Use the task's color for the deadline line
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
                        const isLate = timeline[context.dataIndex]?.isLate;
                        return `${taskId} is running${isLate ? " (Late)" : ""}`;
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
            <h1>Rate Monotonic Scheduling (Bar Chart)</h1>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default App;