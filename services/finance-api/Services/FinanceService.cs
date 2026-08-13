using FarmManagement.SharedKernel.Exceptions;
using FarmManagement.SharedKernel.Models;
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

    public async Task<PagedResponse<IncomeDto>> GetIncomesAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Incomes.AsNoTracking();

        if (startDate.HasValue)
            query = query.Where(i => i.Date >= startDate.Value);
        
        if (endDate.HasValue)
            query = query.Where(i => i.Date <= endDate.Value);

        query = query.OrderByDescending(x => x.Date);
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        
        var dtos = items.Select(i => i.Adapt<IncomeDto>());
        return PagedResponse<IncomeDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<IncomeDto?> GetIncomeByIdAsync(Guid id)
    {
        var entity = await _context.Incomes.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
        return entity?.Adapt<IncomeDto>();
    }

    public async Task<IncomeDto> CreateIncomeAsync(CreateIncomeRequest request)
    {
        var entity = request.Adapt<Income>();
        _context.Incomes.Add(entity);
        await _context.SaveChangesAsync();
        return entity.Adapt<IncomeDto>();
    }

    public async Task<IncomeDto> UpdateIncomeAsync(Guid id, UpdateIncomeRequest request)
    {
        var entity = await _context.Incomes.FirstOrDefaultAsync(i => i.Id == id);
        if (entity == null)
            throw new NotFoundException($"Income with id {id} not found");

        request.Adapt(entity);
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

    public async Task<PagedResponse<ExpenseDto>> GetExpensesAsync(int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Expenses.AsNoTracking();

        if (startDate.HasValue)
            query = query.Where(e => e.Date >= startDate.Value);
        
        if (endDate.HasValue)
            query = query.Where(e => e.Date <= endDate.Value);

        query = query.OrderByDescending(x => x.Date);
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        
        var dtos = items.Select(e => e.Adapt<ExpenseDto>());
        return PagedResponse<ExpenseDto>.Create(dtos, totalCount, page, pageSize);
    }

    public async Task<ExpenseDto?> GetExpenseByIdAsync(Guid id)
    {
        var entity = await _context.Expenses.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);
        return entity?.Adapt<ExpenseDto>();
    }

    public async Task<ExpenseDto> CreateExpenseAsync(CreateExpenseRequest request)
    {
        var entity = request.Adapt<Expense>();
        _context.Expenses.Add(entity);
        await _context.SaveChangesAsync();
        return entity.Adapt<ExpenseDto>();
    }

    public async Task<ExpenseDto> UpdateExpenseAsync(Guid id, UpdateExpenseRequest request)
    {
        var entity = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id);
        if (entity == null)
            throw new NotFoundException($"Expense with id {id} not found");

        request.Adapt(entity);
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
