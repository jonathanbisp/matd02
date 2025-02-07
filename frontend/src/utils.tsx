type Task = {
    id: number;
    executionTime: number;
    deadline: number;
    period: number
}

type Job = {
    deadline: number;
    endTime: number;
    startTime: number;
    taskId: number;
}
export const tasks = [
    { id: 1, executionTime: 3, period: 5, deadline: 5 },
    { id: 2, executionTime: 4, period: 4, deadline: 4 },
];

// Generate jobs for a given time range
export const generateJobs = (tasks: Task[], timeRange: number): any[] => {
    const jobs: any[] = [];

    tasks.forEach((task) => {
        for (let time = 0; time < timeRange; time += task.period) {
            jobs.push({
                taskId: task.id,
                startTime: time,
                endTime: time + task.executionTime,
                deadline: time + task.deadline,
            });
        }
    });
    return jobs as any[];
};

export const scheduleEDF = (jobs: Job[]) => {
    // Sort jobs by deadline for EDF
    return jobs.sort((a, b) => a.deadline - b.deadline);
};

export type ChartData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string;
        borderWidth: number;
    }[];
};


export const prepareChartData = (scheduledJobs: Job[]) :ChartData=> {
    const labels = scheduledJobs.map((job, index) => `Job ${index + 1}`);
    const data = scheduledJobs.map((job) => job.endTime - job.startTime);
    const backgroundColor = scheduledJobs.map((job) =>
        job.taskId === 1 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(153, 102, 255, 0.6)'
    );

    return {
        labels,
        datasets: [
            {
                label: 'Job Execution Time',
                data,
                backgroundColor,
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
        ],
    };
};


export const simulateScheduling = (tasks: Task[], timeRange:number) => {
    const timeline = Array(timeRange).fill(null); // Initialize timeline
    let currentTime = 0;

    while (currentTime < timeRange) {
        // Find the task with the earliest deadline (EDF)
        const nextTask = tasks
            .filter((task) => currentTime % task.period === 0) // Tasks ready to run
            .sort((a, b) => a.deadline - b.deadline)[0]; // EDF priority

        if (nextTask) {
            // Execute the task for its execution time
            for (let i = 0; i < nextTask.executionTime; i++) {
                if (currentTime + i < timeRange) {
                    timeline[currentTime + i] = nextTask.id; // Record task execution
                }
            }
            currentTime += nextTask.executionTime;
        } else {
            currentTime++; // Idle time
        }
    }

    return timeline;
};


export const prepareGanttData = (timeline: any, tasks: Task[]) => {
    const taskIds = tasks.map((task) => task.id);
    const labels = Array.from({ length: timeline.length }, (_, i) => `Time ${i}`);
    const datasets = taskIds.map((taskId) => ({
        label: `Task ${taskId}`,
        data: timeline.map((timeTaskId, index) => (timeTaskId === taskId ? index + 1 : null)), // +1 to avoid 0-height bars
        backgroundColor: taskId === 1 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
    }));

    return { labels, datasets };
};

export const prepareChartDataC = (timeline: any, tasks: Task[]) => {
    const labels = Array.from({ length: timeline.length }, (_, i) => `Time ${i}`);
    const taskColors = {
        1: 'rgba(75, 192, 192, 0.6)', // Task 1 color
        2: 'rgba(153, 102, 255, 0.6)', // Task 2 color
        idle: 'rgba(200, 200, 200, 0.6)', // Idle time color
    };

    const data = timeline.map((taskId) => 1); // All bars have the same height (full y-axis)
    const backgroundColor = timeline.map((taskId) =>
        taskId ? taskColors[taskId] : taskColors.idle
    );

    return {
        labels,
        datasets: [
            {
                label: 'Running Task',
                data,
                backgroundColor,
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
        ],
    };
};


function gcd(a: number, b: number): number {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Helper function to calculate the Least Common Multiple (LCM) of two numbers
function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
}

// Function to calculate the LCM of an array of numbers
function calculateLCM(numbers: number[]): number {
    if (numbers.length === 0) return 0;

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        result = lcm(result, numbers[i]);
    }
    return result;
}

// Function to calculate the LCM of deadlines in the tasks array
export function calculateDeadlineLCM(tasks: Task[]): number {
    const deadlines = tasks.map(task => task.deadline);
    return calculateLCM(deadlines);
}
