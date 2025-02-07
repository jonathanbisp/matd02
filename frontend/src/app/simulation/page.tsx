'use client'

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import {ChartData, generateJobs, prepareChartDataC, scheduleEDF, tasks} from "@/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SchedulingSimulator = () => {
    const [chartData, setChartData] = useState<ChartData | null>(null);

    const runSimulation = () => {
        const timeRange = 20; // Simulate for 20 time units
        const jobs = generateJobs(tasks, timeRange);
        const scheduledJobs = scheduleEDF(jobs);
        const data = prepareChartDataC(scheduledJobs);
        prepareChartData(timeline, tasks);
        setChartData(data);
    };

    return (
        <div>
            <h1>Real-Time Scheduling Simulation</h1>
            <button onClick={runSimulation}>Run Simulation</button>
            {chartData && (
                <div style={{ width: '80%', margin: 'auto' }}>
                    <Bar
                        data={chartData}
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
                                        text: 'Jobs',
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

export default SchedulingSimulator;