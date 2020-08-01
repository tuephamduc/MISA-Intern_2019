namespace MISA.Entities.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Custs",
                c => new
                    {
                        CustID = c.String(nullable: false, maxLength: 128),
                        CustName = c.String(nullable:false),
                        CustCompany = c.String(),
                        TaxNumber = c.Decimal(nullable: true, precision: 18, scale: 2),
                        CustAddress = c.String(),
                        CustPhonenumber = c.Decimal(nullable: false, precision: 18, scale: 2),
                        CustEmail = c.String(),
                        CardCode = c.Decimal(nullable: true, precision: 18, scale: 2),
                        CardLevel = c.Decimal(nullable: true, precision: 18, scale: 2),
                        CustOwe = c.Decimal(nullable: true, precision: 18, scale: 2),
                        CustNote = c.String(),
                        CustDOB = c.DateTime(nullable: true),
                        CustGroup = c.String(),
                        CustCheckMember = c.Boolean(nullable: false),
                        CustType = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.CustID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Custs");
        }
    }
}
