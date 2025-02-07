'use client'


import React, {useState} from "react";
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import {Input} from "@/components/ui/input";
import Form from "@/app/shared/form";
import {Task} from "@/app/types";
import EDFBar from "@/app/simulation-n/EDFBar";
import List from "@/app/shared/list";
import RMSBar from "@/app/simulation-s/RMSBar"; // Import annotation plugin

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
    const t: Task[] = [
        { id: 1, executionTime: 1, deadline: 4, color: "orange" },
        { id: 2, executionTime: 2, deadline: 6, color: "blue" },
        { id: 3, executionTime: 3, deadline: 12, color: "green" },

    ];
    // Define tasks: (execution time, deadline)
    const [tasks, setTasks] = useState<Task[]>(t);
    const [repetitions, setRepetitions] = useState(1);

    const handleRemove = (id: number) => {
        if(tasks.length > 1){
            setTasks([...tasks.filter(t=> t.id !== id)])
        }
    }



    return (
        <div style={{width: "80%", margin: "auto"}}>
            <div className={"w-1/6 mb-5"}>
                <label htmlFor="repetitions">
                    Hiperperiodos
                    <Input type={"number"} id={"repetitions"} value={repetitions}
                           onChange={(e) => setRepetitions(Number(e.target.value))}/>
                </label>
            </div>
            <div>
                <Form
                    onAdd={(data: Omit<Task, 'id'>) => setTasks([...tasks, {
                        ...data,
                        id: Math.max(...tasks.map(t => t.id)) + 1
                    }])}/>
            </div>


            {tasks.length ? (
                <div className={"flex w-full"}>
                    <RMSBar tasks={tasks} repetitions={repetitions}/>
                    <div className={"w-1/6"}>
                        <List tasks={tasks.sort((a, b) => b.deadline - a.deadline)} onRemove={handleRemove}/>
                    </div>
                </div>
            ) : <p> Adicione uma tarefa </p>}

        </div>
    );
};

export default App;