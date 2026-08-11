using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductionApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Dairies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LivestockId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MilkYield = table.Column<decimal>(type: "numeric", nullable: false),
                    FatContent = table.Column<decimal>(type: "numeric", nullable: false),
                    ProteinContent = table.Column<decimal>(type: "numeric", nullable: false),
                    Quality = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TenantId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dairies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dairies_TenantId",
                table: "Dairies",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Dairies_TenantId_LivestockId_Date",
                table: "Dairies",
                columns: new[] { "TenantId", "LivestockId", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dairies");
        }
    }
}
