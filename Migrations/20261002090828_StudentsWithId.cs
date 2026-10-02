using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Oguz_Nyzam.API.Migrations
{
    /// <inheritdoc />
    public partial class StudentsWithId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StudentId",
                table: "Students",
                newName: "StudentCardNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StudentCardNumber",
                table: "Students",
                newName: "StudentId");
        }
    }
}
