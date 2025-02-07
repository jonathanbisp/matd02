import React from 'react';
import {Bar} from "react-chartjs-2";
import {Task} from "@/app/types";

const gcd = (x:number, y:number) => (y === 0 ? x : gcd(y, x % y));
// Function to calculate the least common multiple (LCM) of two numbers
const lcm = (a: number, b:number) => {
    return (a * b) / gcd(a, b);
};

const calculateHyperperiod = (tasks, repetitions) => {
    const t = tasks.map((task) => task.deadline).reduce((acc, deadline) => lcm(acc, deadline), 1);
    return (t * repetitions)
};


function EdfBar({tasks, repetitions}: {tasks: Task[], repetitions: number}) {
    const hyperperiod = calculateHyperperiod(tasks, repetitions);

    const scheduleEDF = () => {
        const timeline = [];
        let currentTime = 0;

        console.log({tasks})

        // Initialize task state
        tasks.forEach((task) => {
            task.remainingTime = task.executionTime;
            task.currentDeadline = task.deadline; // Track the current deadline period
        });

        while (currentTime < hyperperiod) {
            // Find the task with the earliest current deadline
            const availableTasks = tasks.filter((task) => task.remainingTime > 0);
            if (availableTasks.length === 0) {
                // Reset tasks for the next period
                tasks.forEach((task) => {
                    task.remainingTime = task.executionTime;
                    task.currentDeadline += task.deadline; // Move to the next deadline period
                });
                continue;
            }

            const nextTask = availableTasks.reduce((prev, curr) =>
                curr.currentDeadline < prev.currentDeadline ? curr : prev
            );

            // Check if the current execution is after the task's current deadline
            const isExecutionLate = currentTime >= nextTask.currentDeadline;

            // Execute the task
            timeline.push({ time: currentTime, task: nextTask.id, isLate: isExecutionLate });
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

    const timeline = scheduleEDF();


    // Prepare data for Chart.js
    const chartData = {
        labels: Array.from({ length: hyperperiod }, (_, i) => i + 1), // X-axis labels (time)
        datasets: tasks.map((task) => ({
            label: `Task ${task.id}`,
            data: timeline.map((entry) => (entry.task === task.id ? 0.2 : 0)), // Y-axis data
            backgroundColor: timeline.map((entry) =>
                entry.task === task.id && entry.isLate ? task.color : task.color
            ),
            borderColor: timeline.map((entry) =>
                entry.task === task.id && entry.isLate ? "red" : task.color
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

    const schedulable = timeline.filter(t => t.isLate).length > 0
    return (

        <div style={{height: 700, maxHeight: 700}} className={"w-5/6"}>
            <h1>EDF Scheduling (Bar Chart)</h1>
            <Bar data={chartData} options={options} className={'w-5/6'}/>
            {schedulable && (<h2 className={"font-bold text-red-400 text-2xl"}> Não escalonável</h2>)}
        </div>
    );
}

export default EdfBar;