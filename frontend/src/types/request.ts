export type Request = {
    id: string
    publicId: string
    registration: string
    fullName: string
    status: "PENDING"| "APPROVED"| "REJECTED"
    category: string
    createdAt: Date
}
