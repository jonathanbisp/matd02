'use client'

import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import {Deadline, Task} from "@/app/types";
import {ChartData} from "@/utils"; // For deadline annotations

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

// Example tasks
const tasks: Task[] = [
    { id: 1, executionTime: 1, period: 5, deadline: 5 },
    { id: 2, executionTime: 4, period: 5, deadline: 5 },
];

// Simulate scheduling over a time range
const simulateScheduling = (tasks: Task[], timeRange:number) => {
    const timeline = Array(timeRange).fill(null); // Initialize timeline
    const deadlines = []; // Track deadlines for annotations

    let currentTime = 0;

    while (currentTime < timeRange) {
        // Find the task with the earliest deadline (EDF)
        const nextTask = tasks
            .filter((task) => currentTime % task.period === 0) // Tasks ready to run
            .sort((a, b) => a.deadline - b.deadline)[0]; // EDF priority

        if (nextTask) {
            // Record the deadline for this task instance
            deadlines.push({ time: currentTime + nextTask.deadline, taskId: nextTask.id });

            // Execute the task for its execution time
            for (let i = 0; i < nextTask.executionTime; i++) {
                if (currentTime + i < timeRange) {
                    timeline[currentTime + i] = nextTask.id; // Record task execution
                }
            }
            currentTime += nextTask.executionTime;
        } else {
            currentTime++; // Idle time
        }
    }

    return { timeline, deadlines };
};

export const simulateScheduling2 = (tasks: Task[], timeRange:number) => {
    const timeline = Array(timeRange).fill(null); // Initialize timeline
    const deadlines = []; // Track deadlines for annotations

    let currentTime = 0;

    while (currentTime < timeRange) {
        // Find the task with the earliest deadline (EDF)
        const nextTask = tasks
            .filter((task) => currentTime % task.period === 0) // Tasks ready to run
            .sort((a, b) => a.deadline - b.deadline)[0]; // EDF priority

        if (nextTask) {
            // Record the release time (start of execution window)
            deadlines.push({ time: currentTime, taskId: nextTask.id });

            // Execute the task for its execution time
            for (let i = 0; i < nextTask.executionTime; i++) {
                if (currentTime + i < timeRange) {
                    timeline[currentTime + i] = nextTask.id; // Record task execution
                }
            }
            currentTime += nextTask.executionTime;
        } else {
            currentTime++; // Idle time
        }
    }

    return { timeline, deadlines };
};

const simulateScheduling3 = (tasks: Task[], timeRange:number) => {
    const timeline = Array(timeRange).fill(null); // Initialize timeline
    const deadlines = []; // Track deadlines for annotations

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
                    timeline[currentTime + i] = nextTask.id; // Record task execution
                }
            }
            currentTime += nextTask.executionTime;
        } else {
            currentTime++; // Idle time
        }
    }

    return { timeline, deadlines };
};

// Prepare data for the chart
const prepareChartData = (timeline:any, tasks: Task[]) => {
    const labels = Array.from({ length: timeline.length }, (_, i) => `Time ${i}`);
    const taskColors: Record<number | 'idle', string> = {
        1: 'rgba(75, 192, 192, 0.6)', // Task 1 color
        2: 'rgba(153, 102, 255, 0.6)', // Task 2 color
        idle: 'rgba(200, 200, 200, 0.6)', // Idle time color
    };

    const data = timeline.map((taskId: number) => 0.1); // All bars have the same height (full y-axis)
    const backgroundColor = timeline.map((taskId:number) =>
        taskId ? taskColors[taskId] : taskColors.idle
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
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [timeline, setTimeline] = useState<any[]>([]);

    const runSimulation = () => {
        const timeRange = 20; // Simulate for 20 time units
        const { timeline, deadlines: simDeadlines } = simulateScheduling3(tasks, timeRange);
        const data = prepareChartData(timeline, tasks);
        setChartData(data);
        setDeadlines(simDeadlines);
        setTimeline(timeline);
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
                                    annotations: deadlines.map((deadline) => ({
                                        type: 'line',
                                        xMin: deadline.time - 0.5,
                                        xMax: deadline.time - 0.5,
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
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const taskId = timeline[context.dataIndex];
                                            return taskId
                                                ? `Task ${taskId} running at Time ${context.label.replace('Time ', '')}`
                                                : `Idle at Time ${context.label.replace('Time ', '')}`;
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