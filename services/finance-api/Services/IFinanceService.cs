using FinanceApi.DTOs;

namespace FinanceApi.Services;

public interface IFinanceService
{
    Task<(IEnumerable<IncomeDto> Items, int TotalCount, int TotalPages)> GetIncomesAsync(int page, int pageSize);
    Task<IncomeDto> CreateIncomeAsync(CreateIncomeRequest request);
    
    Task<(IEnumerable<ExpenseDto> Items, int TotalCount, int TotalPages)> GetExpensesAsync(int page, int pageSize);
    Task<ExpenseDto> CreateExpenseAsync(CreateExpenseRequest request);
}
