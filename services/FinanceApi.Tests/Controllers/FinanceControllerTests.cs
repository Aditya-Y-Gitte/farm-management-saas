using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using FinanceApi.Controllers;
using FinanceApi.DTOs;
using FinanceApi.Models;
using FinanceApi.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace FinanceApi.Tests.Controllers
{
    public class FinanceControllerTests
    {
        private readonly Mock<IFinanceService> _mockService;
        private readonly FinanceController _controller;

        public FinanceControllerTests()
        {
            _mockService = new Mock<IFinanceService>();
            _controller = new FinanceController(_mockService.Object);
        }

        [Fact]
        public void CreateIncomeRequest_InvalidCategory_FailsValidation()
        {
            var request = new CreateIncomeRequest
            {
                Date = DateTime.UtcNow,
                Category = "InvalidCategory",
                Amount = 100
            };

            var context = new ValidationContext(request);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(request, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("Category"));
        }

        [Fact]
        public void CreateExpenseRequest_InvalidCategory_FailsValidation()
        {
            var request = new CreateExpenseRequest
            {
                Date = DateTime.UtcNow,
                Category = "InvalidCategory",
                Amount = 100
            };

            var context = new ValidationContext(request);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(request, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("Category"));
        }

        [Fact]
        public async Task GetIncomes_InvalidDateRange_ReturnsBadRequest()
        {
            var startDate = new DateTime(2026, 2, 1);
            var endDate = new DateTime(2026, 1, 1);

            var result = await _controller.GetIncomes(1, 20, startDate, endDate);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetExpenses_InvalidDateRange_ReturnsBadRequest()
        {
            var startDate = new DateTime(2026, 2, 1);
            var endDate = new DateTime(2026, 1, 1);

            var result = await _controller.GetExpenses(1, 20, startDate, endDate);

            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
