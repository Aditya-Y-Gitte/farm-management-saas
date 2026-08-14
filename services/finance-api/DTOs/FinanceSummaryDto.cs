namespace FinanceApi.DTOs;

public class FinanceSummaryDto
{
    public decimal TotalIncomeThisMonth { get; set; }
    public decimal TotalExpenseThisMonth { get; set; }
    public decimal NetBalance { get; set; }
}
