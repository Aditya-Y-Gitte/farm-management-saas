using FinanceApi.Data;
using FinanceApi.DTOs;
using FinanceApi.Models;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace FinanceApi.Services;

public class FinanceService : IFinanceService
{
    private readonly FinanceDbContext _context;

    public FinanceService(FinanceDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<IncomeDto> Items, int TotalCount, int TotalPages)> GetIncomesAsync(int page, int pageSize)
    {
        var query = _context.Incomes.AsNoTracking().OrderByDescending(x => x.Date);
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return (items.Adapt<IEnumerable<IncomeDto>>(), totalCount, totalPages);
    }

    public async Task<IncomeDto> CreateIncomeAsync(CreateIncomeRequest request)
    {
        var income = request.Adapt<Income>();
        _context.Incomes.Add(income);
        await _context.SaveChangesAsync();
        return income.Adapt<IncomeDto>();
    }

    public async Task<(IEnumerable<ExpenseDto> Items, int TotalCount, int TotalPages)> GetExpensesAsync(int page, int pageSize)
    {
        var query = _context.Expenses.AsNoTracking().OrderByDescending(x => x.Date);
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return (items.Adapt<IEnumerable<ExpenseDto>>(), totalCount, totalPages);
    }

    public async Task<ExpenseDto> CreateExpenseAsync(CreateExpenseRequest request)
    {
        var expense = request.Adapt<Expense>();
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
        return expense.Adapt<ExpenseDto>();
    }
}
