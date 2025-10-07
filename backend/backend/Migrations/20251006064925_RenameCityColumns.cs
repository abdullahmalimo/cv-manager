using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class RenameCityColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CityName",
                table: "ExperienceInformation",
                newName: "City");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "City",
                table: "ExperienceInformation",
                newName: "CityName");
        }
    }
}
