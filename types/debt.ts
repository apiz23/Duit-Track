export type DebtStatus = "pending" | "paid";

export interface Debt {
    id: string;
    name: string;
    amount: number;
    reason: string;
    status: DebtStatus;
    updated_at?: string;
    created_at?: string;
}
