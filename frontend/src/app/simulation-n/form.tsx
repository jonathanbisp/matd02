import React from 'react';
import {Task} from "@/app/types";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";


type FormProps = {
    onAdd: (data: Task) => void
    length: number
}
function Form(props: FormProps) {
    const {length, onAdd} = props
    const [task, setTask] = React.useState<Task>({id: length + 1, executionTime: 1, deadline: 1, color: 'black'});

    const handleUpdate = (id: string, value: any) => {
        //@ts-ignore
        setTask({...task, [id]: value})
    }

    return (
        <form className={"flex w-full justify-evenly"}>
            <label htmlFor="id">
                ID
                <Input type="number" id={"id"} placeholder={"ID"} value={length + 1} disabled/>
            </label>

            <label htmlFor="executionTime">
                Execution time
                <Input type="number" id={"executionTime"} placeholder={"executionTime"} defaultValue={task.executionTime} onChange={e => handleUpdate("executionTime", Number(e.target.value))}/>
            </label>

            <label htmlFor="deadline">
                Deadline
                <Input type="number" id={"deadline"} placeholder={"deadline"} defaultValue={task.deadline} onChange={e => handleUpdate("deadline", Number(e.target.value))}/>
            </label>

            <label htmlFor="deadline">
                Color
                <Input type="color" id={"color"} placeholder={"color"} defaultValue={task.color} onChange={e => handleUpdate("color", e.target.value)}/>
            </label>

            <Button type={"button"} onClick={() => onAdd(task)}>Add</Button>
        </form>
    );
}

export default Form;