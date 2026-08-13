using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ProductionApi.DTOs;
using ProductionApi.Models;
using Xunit;

namespace ProductionApi.Tests.Controllers
{
    public class FeedConsumptionControllerTests
    {
        [Fact]
        public void CreateRequest_ValidHerdFeed_PassesValidation()
        {
            var request = new CreateFeedConsumptionRequest
            {
                LivestockId = null,
                Date = DateTime.UtcNow,
                FeedType = FeedType.GreenFodder,
                Quantity = 100,
                Unit = FeedUnit.Kg
            };
            
            var context = new ValidationContext(request);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(request, context, results, true);

            Assert.True(isValid);
        }

        [Fact]
        public void CreateRequest_InvalidFeedType_FailsValidation()
        {
            var request = new CreateFeedConsumptionRequest
            {
                Date = DateTime.UtcNow,
                FeedType = "InvalidType",
                Quantity = 100,
                Unit = FeedUnit.Kg
            };
            
            var context = new ValidationContext(request);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(request, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("FeedType"));
        }

        [Fact]
        public void CreateRequest_NegativeQuantity_FailsValidation()
        {
            var request = new CreateFeedConsumptionRequest
            {
                Date = DateTime.UtcNow,
                FeedType = FeedType.GreenFodder,
                Quantity = -5,
                Unit = FeedUnit.Kg
            };
            
            var context = new ValidationContext(request);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(request, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("Quantity"));
        }

        [Fact]
        public void CreateRequest_ZeroQuantity_FailsValidation()
        {
            var request = new CreateFeedConsumptionRequest
            {
                Date = DateTime.UtcNow,
                FeedType = FeedType.GreenFodder,
                Quantity = 0,
                Unit = FeedUnit.Kg
            };
            
            var context = new ValidationContext(request);
            var results = new List<ValidationResult>();

            var isValid = Validator.TryValidateObject(request, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.MemberNames.Contains("Quantity"));
        }
    }
}
