import {CircleCheck, CircleX, Timer} from "lucide-react";

export function formatDateToPortuguese(date: Date) {
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long', // e.g., segunda-feira
        year: 'numeric', // e.g., 2025
        month: 'long',   // e.g., janeiro
        day: 'numeric',  // e.g., 23
    });
}


export function formatRelativeDate(date: Date) {
    if (!(date instanceof Date)) {
        throw new Error("Input must be a Date object.");
    }

    const now = new Date();
    // @ts-ignore
    const diffInMilliseconds = date - now;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
        if (diffInHours === 0) {
            if (diffInMinutes === 0) {
                return "agora mesmo"; // just now
            }
            return diffInMinutes > 0
                ? `${diffInMinutes} minutos`
                : `${Math.abs(diffInMinutes)} minutos`;
        }
        return diffInHours > 0
            ? `${diffInHours} horas atrás`
            : `${Math.abs(diffInHours)} horas atrás`;
    }

    if (diffInDays > 0) {
        if (diffInDays === 1) return "amanhã"; // tomorrow
        return `em ${diffInDays} dias`;
    }

    if (diffInDays < 0) {
        if (diffInDays === -1) return "ontem"; // yesterday
        return `${Math.abs(diffInDays)} dias atrás`;
    }
}


export function statusToTextColor(status: "PENDING"| "APPROVED"| "REJECTED") {
    switch (status) {
        case "PENDING":
            return "text-yellow-800"; // Dark yellow text
        case "APPROVED":
            return "text-green-800";  // Dark green text
        case "REJECTED":
            return "text-red-800";    // Dark red text
        default:
            return "text-gray-800";   // Dark gray for unknown status
    }
}

export function statusToBGColor(status: "PENDING"| "APPROVED"| "REJECTED") {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100"; // Light yellow background
        case "APPROVED":
            return "bg-green-100";  // Light green background
        case "REJECTED":
            return "bg-red-100";    // Light red background
        default:
            return "bg-gray-100";   // Light gray for unknown status
    }
}

export function statusToReadable(status: "PENDING"| "APPROVED"| "REJECTED") {
    if(status === "PENDING") {
        return "Aguardando"
    }else if(status === "REJECTED") {
        return "Rejeitado"
    }else if(status === "APPROVED") {
        return "Aprovado"
    }
    return "Desconhecido"
}

export function statusToBadge(status: "PENDING"| "APPROVED"| "REJECTED") {

    const icon = statusToIcon(status)
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusToTextColor(status)} ${statusToBGColor(status)}`}>{icon}&nbsp;{statusToReadable(status)}</span>
}

export function statusToIcon(status: "PENDING"| "APPROVED"| "REJECTED") {
    if(status === "APPROVED") {
        return <CircleCheck width={14} height={14} />
    }else if(status === "REJECTED") {
        return <CircleX width={14} height={14} />
    }
    else if(status === "PENDING") {
        return <Timer width={14} height={14}/>
    }
}