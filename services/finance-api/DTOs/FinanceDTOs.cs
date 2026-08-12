using System.ComponentModel.DataAnnotations;

namespace FinanceApi.DTOs;

public class IncomeDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal? Quantity { get; set; }
    public decimal? Rate { get; set; }
    public string BuyerName { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class CreateIncomeRequest
{
    [Required]
    public DateTime Date { get; set; }
    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;
    [Required]
    public decimal Amount { get; set; }
    public decimal? Quantity { get; set; }
    public decimal? Rate { get; set; }
    [MaxLength(200)]
    public string BuyerName { get; set; } = string.Empty;
    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;
}

public class ExpenseDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Notes { get; set; } = string.Empty;
    public Guid? RelatedEntityId { get; set; }
}

public class CreateExpenseRequest
{
    [Required]
    public DateTime Date { get; set; }
    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;
    [Required]
    public decimal Amount { get; set; }
    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;
    public Guid? RelatedEntityId { get; set; }
}
