'use client'

import {prepareGanttData, simulateScheduling, tasks} from "@/utils";
import {Bar} from "react-chartjs-2";
import {useState} from "react";

import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RealTimeSchedulingChart = () => {
    const [ganttData, setGanttData] = useState(null);

    const runSimulation = () => {
        const timeRange = 20; // Simulate for 20 time units
        const timeline = simulateScheduling(tasks, timeRange);
        const data = prepareGanttData(timeline, tasks);
        setGanttData(data);
    };

    return (
        <div>
            <h1>Real-Time Scheduling Gantt Chart</h1>
            <button onClick={runSimulation}>Run Simulation</button>
            {ganttData && (
                <div style={{ width: '80%', margin: 'auto' }}>
                    <Bar
                        data={ganttData}
                        options={{
                            indexAxis: 'y',
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
                                        text: 'Tasks',
                                    },
                                },
                            },
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const taskId = context.dataset.label.replace('Task ', '');
                                            return `Task ${taskId} running at Time ${context.raw - 1}`;
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