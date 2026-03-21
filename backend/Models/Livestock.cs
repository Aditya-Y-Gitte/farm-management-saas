using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Livestock
    {
        public Guid Id { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Species { get; set; }
        public string? Breed { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? HealthStatus { get; set; }
        public string? Medication { get; set; }
        public string? Vaccination { get; set; }
    }
}
