using FarmManagement.SharedKernel.Models;
using FinanceApi.DTOs;

namespace FinanceApi.Services;

public interface IFinanceService
{
    Task<PagedResponse<IncomeDto>> GetIncomesAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null);
    Task<IncomeDto?> GetIncomeByIdAsync(Guid id);
    Task<IncomeDto> CreateIncomeAsync(CreateIncomeRequest request);
    Task<IncomeDto> UpdateIncomeAsync(Guid id, UpdateIncomeRequest request);
    Task<bool> DeleteIncomeAsync(Guid id);

    Task<PagedResponse<ExpenseDto>> GetExpensesAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null);
    Task<ExpenseDto?> GetExpenseByIdAsync(Guid id);
    Task<ExpenseDto> CreateExpenseAsync(CreateExpenseRequest request);
    Task<ExpenseDto> UpdateExpenseAsync(Guid id, UpdateExpenseRequest request);
    Task<bool> DeleteExpenseAsync(Guid id);

    Task<FinanceSummaryDto> GetSummaryAsync();
}
