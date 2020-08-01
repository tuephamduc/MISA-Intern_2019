using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.Entities
{
    public class Cust
    {
        public string CustID { get; set; }
        public string CustName { get; set; }
        public string CustCompany { get; set; }
        public decimal TaxNumber { get; set; }
        public string CustAddress { get; set; }
        public decimal CustPhonenumber { get; set; }
        public string CustEmail { get; set; }
        public decimal CardCode { get; set; }
        public decimal CardLevel { get; set; }
        public decimal CustOwe { get; set; }
        public string CustNote { get; set; }
        public DateTime CustDOB { get; set; }
        public string CustGroup { get; set; }
        public bool CustCheckMember { get; set; }
        public bool CustType { get; set; }
    }
}
