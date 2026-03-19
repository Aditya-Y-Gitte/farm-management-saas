using System;

namespace backend.Models
{
    public class Dairy
    {
        public Guid Id { get; set; }
        public Guid LivestockId { get; set; }
        public DateTime Date { get; set; }
        public decimal MilkYield { get; set; }
        public decimal FatContent { get; set; }
        public decimal ProteinContent { get; set; }
        public string? Quality { get; set; }
    }
}
