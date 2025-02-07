import React from 'react';
import {Task} from "@/app/types";
import {Button} from "@/components/ui/button";


type ListProps = {tasks: Task[], onRemove: (id: number ) => void}
function List({tasks, onRemove}: ListProps) {
    const header = <li className={"font-bold text-white p-2"} key={'x'}
                       style={{backgroundColor: 'gray', listStyle: 'none'}}> ID&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;(C,T)    </li>
    const items = tasks.map((task) =>
        <li className={"font-bold text-white p-2  flex items-center justify-between"} key={task.id}
            style={{backgroundColor: task.color, listStyle: 'none'}}>{task.id}&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{task.executionTime}, {task.deadline}
            <Button className={'font-bold text-2xl'} variant={'ghost'}
            onClick={() => onRemove(task.id)}> x </Button></li>)
    return (
        <div>
            {header}
            {items}
        </div>
    );
}

export default List;