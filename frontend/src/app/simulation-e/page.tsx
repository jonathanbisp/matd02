'use client'


import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import {Deadline, Job, Task} from "@/app/types";
import {calculateDeadlineLCM, ChartData} from "@/utils";
import {ready} from "next/dist/build/output/log"; // For deadline annotations

const loop = 3

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

// Example jobs
const jobs: Job[] = [
    { id: 1, release: 0, executionTime: 3, period: 5, deadline: 5 },
    { id: 2, release: 0, executionTime: 3, period: 5, deadline: 5 },
];


type T = {
    id: string
    executionTime: number
    deadlineId: number
    parentId: number
}
const clone = (content: any) => JSON.parse(JSON.stringify(content))

// function randomId() {
//     return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
// }

const factory = (job: Job, loop: number): T[] => {
    let tasks = []

    for(let t = 0; t <= job.executionTime; t++){
        tasks.push({id: `${job.id}-${t}`, parentId: job.id, executionTime: 1, deadlineId: loop })
    }

    return tasks
}

// Simulate scheduling over a time range
const simulateScheduling = (jobs: Job[], timeRange:number) => {
    const timeline = Array(timeRange).fill(null); // Initialize timeline
    const deadlines = []; // Track deadlines for annotations
    const missedDeadlines = []; // Track missed deadlines
    let tasks: T[] = [];

    let currentTime = 0;
    let globalReady :any[] = []
    let runs = 0
    let mmc = calculateDeadlineLCM(jobs)

    for(let i = 0; i<= loop; i++){
        const absoluteDeadline = mmc * i
        deadlines.push({ time: absoluteDeadline, id: i });
    }

    for(const d of deadlines){
        for(const j of jobs){
            const newTasks = factory(j, d.id);

            tasks = [...tasks, ...newTasks]
        }
    }

    for(const t of timeline){
        const [maxPriority] = jobs.sort((a, b) => b.deadline - a.deadline).slice(1)

        const toPlaceTasks = tasks
            .sort((a, b) => b.deadlineId - a.deadlineId)
            .filter((task) => task.parentId === maxPriority.id).slice(0, maxPriority.executionTime -1)

        // const loopTasks = tasks.sort()

        // for(const l of loop){
        // }
    }



    while (currentTime < timeRange) {
        // const factor = runs + 1;
        console.log({ currentTime, timeRange})
        // console.log({absoluteDeadline})
        const newGlobal = globalReady

        // deadlines.push({ time: absoluteDeadline });


        let ready = clone(jobs
            .filter((task) => currentTime % task.period === 0)) // jobs ready to run

        if(!ready.length && globalReady.length){
            ready = clone(newGlobal)// jobs ready to run
            globalReady =  newGlobal.slice(1)

        }else if(ready.length){
            // console.log("readdy", ready)
            globalReady = clone(ready.slice(1))


        }


        // console.log(ready)
        // console.log(ready.length)


        const nextTask = structuredClone(ready.shift())


        // console.log("NEXT TASK " +JSON.stringify({nextTask}))

        if (nextTask) {
            const myDeadline = deadlines[nextTask.release]

            // Execute the task for its execution time
            for (let i = 0; i < nextTask.executionTime; i++) {
                if (currentTime + i < timeRange) {
                    timeline[currentTime + i] = {
                        taskId: nextTask.id,
                        isMissed: (currentTime + i > absoluteDeadline) ,
                    };
                }
            }

            // Check if the task missed its deadline
            if ((currentTime + nextTask.executionTime > absoluteDeadline)) {
                missedDeadlines.push({ time: absoluteDeadline, taskId: nextTask.id });
            }

            currentTime += nextTask.executionTime;
        } else {
            currentTime++; // Idle time
        }
        runs++
    }

    return { timeline, deadlines, missedDeadlines };
};

// Prepare data for the chart
const prepareChartData = (timeline: any, jobs: Task[]) => {
    const labels = Array.from({ length: timeline.length }, (_, i) => `Time ${i}`);
    const taskColors = {
        1: 'rgba(75, 192, 192, 0.6)', // Task 1 color
        2: 'rgba(153, 102, 255, 0.6)', // Task 2 color
        idle: 'rgba(0, 0, 0, 0)', // Idle time color
        missed: 'rgba(255, 99, 132, 0.6)', // Missed deadline color
    };

    const borderColors = {
        1: 'rgba(75, 192, 192, 0.6)', // Task 1 color
        2: 'rgba(153, 102, 255, 0.6)', // Task 2 color
        idle: 'rgba(0, 0, 0, 0)', // Idle time color
        missed: 'rgba(255, 99, 132, 0.6)', // Missed deadline color
    };

    const data = timeline.map(() => 0.1); // All bars have the same height (full y-axis)
    const backgroundColor = timeline.map((task) => {
        if (!task) return taskColors.idle; // Idle time
        return task.isMissed ? taskColors.missed : taskColors[task.taskId]; // Task color or missed deadline color
    });

    const borderColor = timeline.map((task) => {
        if (!task) return borderColors.idle; // Idle time
        return task.isMissed ? borderColors.missed : borderColors[task.taskId]; // Task color or missed deadline color
    });

    return {
        labels,
        datasets: [
            {
                label: 'Running Task',
                data,
                backgroundColor,
                borderColor,
                borderWidth: 1,
            },
        ],
    };
};

const RealTimeSchedulingChart = () => {
    // const [missedDeadlines, setMissedDeadlines] = useState([]);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [timeline, setTimeline] = useState<any[]>([]);

    const runSimulation = () => {
        const timeRange = 4 * loop; // Simulate for 20 time units
        const { timeline, deadlines: simDeadlines } = simulateScheduling(jobs, timeRange);
        const data = prepareChartData(timeline, jobs);

        console.log({timeline})

        setTimeline(timeline)
        setChartData(data);
        setDeadlines(simDeadlines);
        // setMissedDeadlines(simMissedDeadlines);
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
                                            xMin: deadline.time - 0.5,
                                            xMax: deadline.time - 0.5,
                                            yMin: 0,
                                            yMax: 1,
                                            borderColor: 'red',
                                            borderWidth: 2,
                                            label: {
                                                content: `Deadline (Task ${deadline})`,
                                                enabled: true,
                                                position: 'end',
                                                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                                            },
                                        })),
                                        // ...missedDeadlines.map((missed) => ({
                                        //     type: 'line',
                                        //     xMin: missed.time,
                                        //     xMax: missed.time,
                                        //     yMin: 0,
                                        //     yMax: 1,
                                        //     borderColor: 'black',
                                        //     borderWidth: 2,
                                        //     borderDash: [5, 5], // Dashed line for missed deadlines
                                        //     label: {
                                        //         content: `Missed Deadline (Task ${missed.taskId})`,
                                        //         enabled: true,
                                        //         position: 'end',
                                        //         backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        //     },
                                        // })),
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

1,4
2,3