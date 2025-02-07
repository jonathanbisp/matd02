export type Job = {
    id: number;
    executionTime: number;
    release: number;
    deadline: number;
    period: number
}


export type Deadline ={ time: number, taskId: number }