using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Dairy
    {
        public Guid Id { get; set; }
        [Required]
        public Guid LivestockId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public decimal MilkYield { get; set; }
        public decimal FatContent { get; set; }
        public decimal ProteinContent { get; set; }
        public string? Quality { get; set; }
    }
}
