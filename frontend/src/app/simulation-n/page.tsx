'use client'


import React, {useEffect, useState} from "react";
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import {Task} from "@/app/types";
import Form from "@/app/simulation-n/form";
import List from "@/app/simulation-n/list";
import {data} from "@/app/requests/all/fixtures";
import {ChartData} from "@/utils";
import EDFBar from "@/app/simulation-n/EDFBar";

// Register Chart.js components
Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, annotationPlugin);





const App = () => {
    // Define tasks: (execution time, deadline)
    const t: Task[] = [
        { id: 1, executionTime: 2, deadline: 4, color: "blue" },
        { id: 2, executionTime: 3, deadline: 5, color: "green" },
    ];

    const [tasks, setTasks] = useState<Task[]>(t);


    const handleRemove = (id: number) => {
        if(tasks.length > 1){
            setTasks([...tasks.filter(t=> t.id !== id)])
        }
    }

    return (
        <div style={{ width: "80%", margin: "auto" }}>
            <Form onAdd={(data: Task) => setTasks([...tasks, data])} length={Math.max(...tasks.map(t => t.id))}/>
            {tasks.length ? (
                <div  className={"flex w-full"}>
                    <EDFBar tasks={tasks} />
                    <div className={"w-1/6"}>
                        <List tasks={tasks.sort( (a, b) => b.deadline - a.deadline)} onRemove={handleRemove} />
                    </div>
                </div>
            ) : <p> Adicione uma tarefa </p>}
        </div>
    );
};

export default App;