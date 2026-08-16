export interface Income {
    id: string;
    date: string;
    category: string;
    amount: number;
    quantity?: number;
    rate?: number;
    buyerName?: string;
    notes?: string;
}

export interface CreateIncomeRequest {
    date: string;
    category: string;
    amount: number;
    quantity?: number;
    rate?: number;
    buyerName?: string;
    notes?: string;
}

export interface Expense {
    id: string;
    date: string;
    category: string;
    amount: number;
    notes?: string;
    relatedEntityId?: string;
}

export interface CreateExpenseRequest {
    date: string;
    category: string;
    amount: number;
    notes?: string;
    relatedEntityId?: string;
}

export interface FinanceSummaryDto {
    totalIncomeThisMonth: number;
    totalExpenseThisMonth: number;
    netBalance: number;
}
