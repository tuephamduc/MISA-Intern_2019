using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using MISA.DL;
using MISA.Entities;
using MISA.GUI.Properties;

namespace MISA.GUI.Controllers
{
    public class CustsController : ApiController
    {
        private CustDL _custDL = new CustDL();

        /// <summary>
        /// Service thực hiện lấy tất cả dữ liệu của khách hàng
        /// </summary>
        /// <param ></param>
        /// <returns> Danh sách dữ liệu của tất cả khách hàng </returns>
        /// Created by PDTue 23/08/2019
        [Route("customers")]
        [HttpGet]
        public AjaxResult GetAllCusts()
        {
            var ajaxResult = new AjaxResult();
            try
            {
                ajaxResult.Data = _custDL.GetAllData();
            }
            catch (Exception ex)
            {
                ajaxResult.Data = ex;
                ajaxResult.Success = false;
                ajaxResult.Message = Resources.MessageVN;
            }
            return ajaxResult;
        }

        /// <summary>
        /// Service thực hiện lấy tất cả dữ liệu của khách hàng theo trang và kích cỡ trang
        /// </summary>
        /// <param name="_pageIndex"></param>
        /// <param name="_pageSize"></param>
        /// <returns> Danh sách dữ liệu của khách hàng </returns>
        /// Created by PDTue 23/08/2019
        [Route("customers/{_pageIndex}/{_pageSize}")]
        [HttpGet]
        public async Task<AjaxResult> GetCusts([FromUri]int _pageIndex,int _pageSize)
        {
            await Task.Delay(1000);
            var ajaxResult = new AjaxResult();
            try
            {
                ajaxResult.Data = _custDL.GetCustData(_pageIndex, _pageSize);
            }
            catch (Exception ex)
            {
                ajaxResult.Data = ex;
                ajaxResult.Success = false;
                ajaxResult.Message = Resources.MessageVN;
            }
            return ajaxResult;
        }

        /// <summary>
        /// Service thực hiện thêm khách hàng
        /// </summary>
        /// <param name="_cust"></param>
        /// <returns> Dữ liệu khách hàng</returns>
        /// Created by PDTue 23/08/2019
        [Route("customers")]
        [HttpPost]
        public AjaxResult Post([FromBody]Cust _cust)
        {
            var ajaxResult = new AjaxResult();
            try
            {
                _custDL.AddCust(_cust);
            }
            catch (Exception ex)
            {
                ajaxResult.Data = ex;
                ajaxResult.Success = false;
                ajaxResult.Message = Resources.MessageVN;
            }
            return ajaxResult;
        }

        /// <summary>
        /// Service thực hiện sửa khách hàng
        /// </summary>
        /// <param name="_cust"></param>
        /// <returns> Dữ liệu khách hàng</returns>
        /// Created by PDTue 23/08/2019
        [Route("customers")]
        [HttpPut]
        public AjaxResult Put([FromBody] Cust _cust)
        {
            var ajaxResult = new AjaxResult();
            try
            {
                _custDL.UpdateCust(_cust);
            }
            catch (Exception ex)
            {
                ajaxResult.Data = ex;
                ajaxResult.Success = false;
                ajaxResult.Message = Resources.MessageVN;
            }
            return ajaxResult;
        }

        /// <summary>
        /// Service thực hiện xóa khách hàng
        /// </summary>
        /// <param name="_custIds"></param>
        /// <returns> Dữ liệu khách hàng</returns>
        /// Created by PDTue 23/08/2019
        [Route("customers")]
        [HttpDelete]
        public AjaxResult Delete([FromBody]List<string> _custIds)
        {
            var ajaxResult = new AjaxResult();
            try
            {
                _custDL.DeleteCust(_custIds);
            }
            catch (Exception ex)
            {
                ajaxResult.Data = ex;
                ajaxResult.Success = false;
                ajaxResult.Message = Resources.MessageVN;
            }
            return ajaxResult;
        }

        /// <summary>
        /// Service thực hiện lấy dữ liệu khách hàng theo id
        /// </summary>
        /// <param name="id"></param>
        /// <returns> Dữ liệu khách hàng</returns>
        /// Created by PDTue 23/08/2019
        [Route("customers/{id}")]
        [HttpGet]
        public AjaxResult GetCustById(string id)
        {
            var ajaxResult = new AjaxResult();
            try
            {
                ajaxResult.Data = _custDL.GetCustById(id);
            }
            catch (Exception ex)
            {
                ajaxResult.Data = ex;
                ajaxResult.Success = false;
                ajaxResult.Message = Resources.MessageVN;
            }
            return ajaxResult;
        }

    }
}