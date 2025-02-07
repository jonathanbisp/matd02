import React, {JSX} from 'react';
import {Task} from "@/app/types";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";


type FormProps = {
    onAdd: (data: Omit<Task, 'id'>) => void
}
function Form(props: FormProps) {
    const { onAdd} = props
    const [task, setTask] = React.useState<Omit<Task, 'id'>>({executionTime: 1, deadline: 1, color: 'black'});

    const handleUpdate = (id: string, value: any) => {
        //@ts-ignore
        setTask({...task, [id]: value})
    }

    return (
        <form className={"flex w-full justify-between bg-gray-300 p-5 mb-5"}>
            <label htmlFor="executionTime">
                Execution time
                <Input type="number" id={"executionTime"} min={1} placeholder={"executionTime"} defaultValue={task.executionTime} onChange={e => handleUpdate("executionTime", Number(e.target.value))}/>
            </label>

            <label htmlFor="deadline">
                Deadline
                <Input type="number" id={"deadline"} min={1} placeholder={"deadline"} defaultValue={task.deadline} onChange={e => handleUpdate("deadline", Number(e.target.value))}/>
            </label>

            <label htmlFor="deadline">
                Color
                <Input type="color" id={"color"} placeholder={"color"} defaultValue={task.color} onChange={e => handleUpdate("color", e.target.value)}/>
            </label>

            <Button type={"button"} size={'icon'} onClick={() => onAdd(task)}>Add</Button>
        </form>
    );
}

export default Form;