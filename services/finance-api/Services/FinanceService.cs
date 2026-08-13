using FinanceApi.Data;
using FinanceApi.DTOs;
using FinanceApi.Models;
using FarmManagement.SharedKernel.Exceptions;
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

    public async Task<(IEnumerable<IncomeDto> Items, int TotalCount, int TotalPages)> GetIncomesAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Incomes.AsNoTracking();

        if (startDate.HasValue)
            query = query.Where(i => i.Date >= startDate.Value);
        
        if (endDate.HasValue)
            query = query.Where(i => i.Date <= endDate.Value);

        query = query.OrderByDescending(x => x.Date);
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return (items.Adapt<IEnumerable<IncomeDto>>(), totalCount, totalPages);
    }

    public async Task<IncomeDto?> GetIncomeByIdAsync(Guid id)
    {
        var entity = await _context.Incomes.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
        return entity?.Adapt<IncomeDto>();
    }

    public async Task<IncomeDto> CreateIncomeAsync(CreateIncomeRequest request)
    {
        var income = request.Adapt<Income>();
        _context.Incomes.Add(income);
        await _context.SaveChangesAsync();
        return income.Adapt<IncomeDto>();
    }

    public async Task<IncomeDto> UpdateIncomeAsync(Guid id, UpdateIncomeRequest request)
    {
        var entity = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id);
        if (entity == null) throw new NotFoundException($"Income with ID {id} not found.");

        entity.Date = request.Date;
        entity.Category = request.Category;
        entity.Amount = request.Amount;
        entity.Quantity = request.Quantity;
        entity.Rate = request.Rate;
        entity.BuyerName = request.BuyerName;
        entity.Notes = request.Notes;

        await _context.SaveChangesAsync();
        return entity.Adapt<IncomeDto>();
    }

    public async Task<bool> DeleteIncomeAsync(Guid id)
    {
        var entity = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id);
        if (entity == null) return false;

        _context.Incomes.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<(IEnumerable<ExpenseDto> Items, int TotalCount, int TotalPages)> GetExpensesAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Expenses.AsNoTracking();

        if (startDate.HasValue)
            query = query.Where(e => e.Date >= startDate.Value);
        
        if (endDate.HasValue)
            query = query.Where(e => e.Date <= endDate.Value);

        query = query.OrderByDescending(x => x.Date);
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        return (items.Adapt<IEnumerable<ExpenseDto>>(), totalCount, totalPages);
    }

    public async Task<ExpenseDto?> GetExpenseByIdAsync(Guid id)
    {
        var entity = await _context.Expenses.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        return entity?.Adapt<ExpenseDto>();
    }

    public async Task<ExpenseDto> CreateExpenseAsync(CreateExpenseRequest request)
    {
        var expense = request.Adapt<Expense>();
        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();
        return expense.Adapt<ExpenseDto>();
    }

    public async Task<ExpenseDto> UpdateExpenseAsync(Guid id, UpdateExpenseRequest request)
    {
        var entity = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id);
        if (entity == null) throw new NotFoundException($"Expense with ID {id} not found.");

        entity.Date = request.Date;
        entity.Category = request.Category;
        entity.Amount = request.Amount;
        entity.Notes = request.Notes;
        entity.RelatedEntityId = request.RelatedEntityId;

        await _context.SaveChangesAsync();
        return entity.Adapt<ExpenseDto>();
    }

    public async Task<bool> DeleteExpenseAsync(Guid id)
    {
        var entity = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id);
        if (entity == null) return false;

        _context.Expenses.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
