'use client'

import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation'; // For deadline annotations

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

// Example tasks
const tasks = [
    { id: 1, executionTime: 2, period: 5, deadline: 5 },
    { id: 2, executionTime: 3, period: 5, deadline: 10 },
];

// Simulate scheduling over a time range
const simulateScheduling = (tasks, timeRange) => {
    const timeline = Array(timeRange).fill(null); // Initialize timeline
    const deadlines = []; // Track deadlines for annotations
    const missedDeadlines = []; // Track missed deadlines

    let currentTime = 0;

    while (currentTime < timeRange) {
        // Find the task with the earliest deadline (EDF)
        const nextTask = tasks
            .filter((task) => currentTime % task.period === 0) // Tasks ready to run
            .sort((a, b) => a.deadline - b.deadline)[0]; // EDF priority

        if (nextTask) {
            // Record the absolute deadline (release time + deadline)
            const releaseTime = currentTime;
            const absoluteDeadline = releaseTime + nextTask.deadline;
            deadlines.push({ time: absoluteDeadline, taskId: nextTask.id });

            // Execute the task for its execution time
            for (let i = 0; i < nextTask.executionTime; i++) {
                if (currentTime + i < timeRange) {
                    timeline[currentTime + i] = {
                        taskId: nextTask.id,
                        isMissed: currentTime + i > absoluteDeadline, // Check if deadline is missed
                    };
                }
            }

            // Check if the task missed its deadline
            if (currentTime + nextTask.executionTime > absoluteDeadline) {
                missedDeadlines.push({ time: absoluteDeadline, taskId: nextTask.id });
            }

            currentTime += nextTask.executionTime;
        } else {
            currentTime++; // Idle time
        }
    }

    return { timeline, deadlines, missedDeadlines };
};

// Prepare data for the chart (excluding idle tasks)
const prepareChartData = (timeline, tasks) => {
    const taskColors = {
        1: 'rgba(75, 192, 192, 0.6)', // Task 1 color
        2: 'rgba(153, 102, 255, 0.6)', // Task 2 color
        missed: 'rgba(255, 99, 132, 0.6)', // Missed deadline color
    };

    // Filter out idle time units
    const filteredTimeline = timeline.filter((task) => task !== null);
    const labels = filteredTimeline.map((_, i) => `Time ${i}`);
    const data = filteredTimeline.map(() => 1); // All bars have the same height (full y-axis)
    const backgroundColor = filteredTimeline.map((task) =>
        task.isMissed ? taskColors.missed : taskColors[task.taskId] // Task color or missed deadline color
    );

    return {
        labels,
        datasets: [
            {
                label: 'Running Task',
                data,
                backgroundColor,
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
        ],
    };
};

const RealTimeSchedulingChart = () => {
    const [chartData, setChartData] = useState(null);
    const [deadlines, setDeadlines] = useState([]);
    const [missedDeadlines, setMissedDeadlines] = useState([]);
    const [timeline, setTimeline] = useState<any[]>([]);

    const runSimulation = () => {
        const timeRange = 20; // Simulate for 20 time units
        const { timeline: tm, deadlines: simDeadlines, missedDeadlines: simMissedDeadlines } = simulateScheduling(tasks, timeRange);
        const data = prepareChartData(tm, tasks);
        setChartData(data);
        setDeadlines(simDeadlines);
        setTimeline(tm)
        setMissedDeadlines(simMissedDeadlines);
    };

    return (
        <div>
            <h1>Real-Time Scheduling with Deadlines</h1>
            <button onClick={runSimulation}>Run Simulation</button>
            {chartData && (
                <div style={{ width: '80%', margin: 'auto' }}>
                    <Bar
                        data={chartData}
                        options={{
                            indexAxis: 'x',
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Running Task',
                                    },
                                    min: 0,
                                    max: 1,
                                    ticks: {
                                        stepSize: 1,
                                        callback: (value) => (value === 1 ? 'Running' : ''),
                                    },
                                },
                            },
                            plugins: {
                                annotation: {
                                    annotations: [
                                        ...deadlines.map((deadline) => ({
                                            type: 'line',
                                            xMin: deadline.time,
                                            xMax: deadline.time,
                                            yMin: 0,
                                            yMax: 1,
                                            borderColor: 'red',
                                            borderWidth: 2,
                                            label: {
                                                content: `Deadline (Task ${deadline.taskId})`,
                                                enabled: true,
                                                position: 'end',
                                                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                                            },
                                        })),
                                        ...missedDeadlines.map((missed) => ({
                                            type: 'line',
                                            xMin: missed.time,
                                            xMax: missed.time,
                                            yMin: 0,
                                            yMax: 1,
                                            borderColor: 'black',
                                            borderWidth: 2,
                                            borderDash: [5, 5], // Dashed line for missed deadlines
                                            label: {
                                                content: `Missed Deadline (Task ${missed.taskId})`,
                                                enabled: true,
                                                position: 'end',
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            },
                                        })),
                                    ],
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const task = timeline[context.dataIndex];
                                            if (!task) return `Idle at Time ${context.label.replace('Time ', '')}`;
                                            return task.isMissed
                                                ? `Task ${task.taskId} missed deadline at Time ${context.label.replace('Time ', '')}`
                                                : `Task ${task.taskId} running at Time ${context.label.replace('Time ', '')}`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default RealTimeSchedulingChart;