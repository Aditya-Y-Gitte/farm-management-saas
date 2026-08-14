import apiClient from './apiClient';
import { Income, CreateIncomeRequest, Expense, CreateExpenseRequest } from '../types/finance';
import { PaginatedResponse } from './livestockService';

const BASE_PATH = '/api/finance';

export const getIncomes = async (page = 1, pageSize = 20): Promise<PaginatedResponse<Income>> => {
  const response = await apiClient.get(`${BASE_PATH}/income`, { params: { page, pageSize } });
  return response.data;
};

export const createIncome = async (income: CreateIncomeRequest): Promise<Income> => {
  const response = await apiClient.post(`${BASE_PATH}/income`, income);
  return response.data;
};

export const getExpenses = async (page = 1, pageSize = 20): Promise<PaginatedResponse<Expense>> => {
  const response = await apiClient.get(`${BASE_PATH}/expense`, { params: { page, pageSize } });
  return response.data;
};

export const createExpense = async (expense: CreateExpenseRequest): Promise<Expense> => {
  const response = await apiClient.post(`${BASE_PATH}/expense`, expense);
  return response.data;
};

export const getFinanceSummary = async () => {
  const response = await apiClient.get(`${BASE_PATH}/summary`);
  return response.data;
};
