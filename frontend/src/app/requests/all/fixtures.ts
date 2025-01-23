const getRandomElement = <T>(array: T[] ):T => array[Math.floor(Math.random() * array.length)];

const statuses = ["PENDING", "APPROVED", "REJECTED"];
const fullNames = [
    "Fulano Ciclano da Silva",
    "Beltrano de Souza",
    "Maria Joaquina",
    "José da Silva",
    "Ana Clara Santos",
    "João Pedro Oliveira",
    "Carlos Alberto",
    "Fernanda Lima",
    "Paulo Henrique",
    "Juliana Costa",
];
const categories = [
    "Disc. Optativa",
    "Disc. Obrigatória",
    "Atividade Complementar",
    "Estágio Supervisionado",
    "Projeto Integrador",
];

export const data = Array.from({ length: 20 }, (_, i) => ({
    id: `random-id-${i + 1}`,
    publicId: `SOL-891${i + 1}`,
    registration: `${123456778 + i}`,
    fullName: getRandomElement(fullNames),
    status: getRandomElement(statuses),
    category: getRandomElement(categories),
    createdAt: new Date(
        new Date(2023, 0, 1).getTime() +
        Math.random() * (new Date().getTime() - new Date(2023, 0, 1).getTime())
    ),
}));
