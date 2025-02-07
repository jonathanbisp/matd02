'use client'
import {Bar} from "react-chartjs-2";
import {prepareChartDataC, simulateScheduling, tasks} from "@/utils";
import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RealTimeSchedulingChart = () => {
    const [chartData, setChartData] = useState(null);

    const runSimulation = () => {
        const timeRange = 20; // Simulate for 20 time units
        const timeline = simulateScheduling(tasks, timeRange);
        const data = prepareChartDataC(timeline, tasks);
        setChartData(data);
    };

    return (
        <div>
            <h1>Real-Time Scheduling Visualization</h1>
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