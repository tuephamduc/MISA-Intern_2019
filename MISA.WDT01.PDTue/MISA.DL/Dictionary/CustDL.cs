using MISA.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.DL
{
    public class CustDL
    {
        private MISAGUIContext db = new MISAGUIContext();
         // Hàm lấy tất cả dữ liệu về khách hàng
         // Người tạo: PDTue 22/08/2019
        public IEnumerable<Cust> GetAllData()
        {
            return db.Custs;
        }

        // Hàm lấy danh sách dữ liệu khách hàng theo index và size
        // Người tạo: PDTue 22/08/2019
        public IEnumerable<Cust> GetCustData(int _pageIndex,int _pageSize)
        {
            return db.Custs.OrderBy(p => p.CustID)
                .Skip((_pageIndex - 1) * _pageSize)
                .Take(_pageSize);
        }

        // Hàm thực hiện thêm mới dữ liệu khách hàng
        // Người tạo: PDTue 23/08/2019
        public void AddCust(Cust _cust)
        {
            db.Custs.Add(_cust);
            db.SaveChanges();
        }

        // Hàm thực hiện xóa dữ liệu khách hàng
        // Người tạo: PDTue 23/08/2019
        public void DeleteCust(List<string> _custIds)
        {
            foreach(var _custId in _custIds)
            {
                var _custItem = db.Custs.Where(p => p.CustID == _custId).FirstOrDefault();
                db.Custs.Remove(_custItem);
                db.SaveChanges();
            }
        }

        // Hàm thực hiện sửa dữ liệu khách hàng
        // Người tạo: PDTue 23/08/2019
        public void UpdateCust(Cust _cust)
        {
            var custFind = db.Custs.Where(p => p.CustID == _cust.CustID).SingleOrDefault();
            custFind.CustName = _cust.CustName;
            //custFind.CardCode = _cust.CardCode;
            //custFind.CardLevel = _cust.CardLevel;
            custFind.CustAddress = _cust.CustAddress;
            custFind.CustCompany = _cust.CustCompany;
            custFind.CustDOB = _cust.CustDOB;
            custFind.CustEmail = _cust.CustEmail;
            custFind.CustGroup = _cust.CustGroup;
            custFind.CustNote = _cust.CustNote;
            custFind.CustPhonenumber = _cust.CustPhonenumber;
            //custFind.CustType = _cust.CustType;
            custFind.TaxNumber = _cust.TaxNumber;
            custFind.CustType = _cust.CustType;
            db.SaveChanges();
        }

        // Hàm thực hiện lấy dữ liệu khách hàng theo id
        // Người tạo: PDTue 23/08/2019
        public Cust GetCustById(string id)
        {
            var custFind = db.Custs.Where(p => p.CustID == id).FirstOrDefault();
            return custFind;
        }

    }
}
