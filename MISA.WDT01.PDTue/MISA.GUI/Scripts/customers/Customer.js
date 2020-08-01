$(document).ready(function () {

});
class Cust extends Base {
    constructor() {
        super();
        this.loadData();
        this.InitEvent();
    }
    InitEvent() {
        $('tbody').on('click', 'tr', { jsObject: this }, this.RowOnClick);

        $('.master-toolbar').on('click', '#btnToolAdd', this.ShowDialogAdd.bind(this));
        $('.master-toolbar').on('click', '#btnToolDelete', this.ShowDialogDelete.bind(this));
        $('.master-toolbar').on('click', '#btnToolEdit', this.ShowDialogEdit.bind(this));
        $('.master-toolbar').on('click', '#btnToolReload', this.ReloadPage.bind(this));
        $(document).on('click', '#load-page', this.ReloadPage.bind(this));

        $(document).on('click', '.dialog-add #btnSave', { method: "POST" }, this.OnlySaveCust.bind(this));
        $(document).on('click', '.dialog-edit #btnSave', { method: "PUT" }, this.OnlySaveCust.bind(this));
        $(document).on('click', '.dialog-add #btnSaveAdd', { method: "POST" }, this.SaveAddCust.bind(this));
        $(document).on('click', '.dialog-edit #btnSaveAdd', { method: "PUT" }, this.SaveAddCust.bind(this));
        $(document).on('click', '.dialog-delete #btnDeleteYes', this.DeleteCusts.bind(this));
        $(document).on('click', '.dialog-delete #btnDeleteCancel', this.CloseDialog.bind(this, '#dialog-delete'));
        $(document).on('click', '.dialog-submit-add #btnDeleteCancel', this.CloseDialog.bind(this, '#dialog-delete,#dialog')); // btnDeleteCancel là nút không
        $(document).on('click', '.dialog-submit-edit #btnDeleteCancel', this.CloseDialog.bind(this, '#dialog-delete,#dialog'));
        $(document).on('click', '.dialog-submit-add #btnDeleteNo', this.CloseDialog.bind(this, '#dialog-delete')); // btnDeleteNo là nút hủy bỏ
        $(document).on('click', '.dialog-submit-edit #btnDeleteNo', this.CloseDialog.bind(this, '#dialog-delete'));


        $(document).on('click', '.dialog-submit-add #btnDeleteYes', { method: "POST" }, this.OnlySaveCust.bind(this));
        $(document).on('click', '.dialog-submit-edit #btnDeleteYes', { method: "PUT" }, this.OnlySaveCust.bind(this));

        $(document).on('click', '.dialog-add #btnCancel, .dialog-add .ui-dialog-titlebar-close', { method: "POST" }, this.SubmitCancel.bind(this));
        $(document).on('click', '.dialog-edit #btnCancel, .dialog-edit .ui-dialog-titlebar-close', { method: "PUT" }, this.SubmitCancel.bind(this));

        $(document).on('click', '#checkType', this.ChangeStatusCheck);
        $('#dialog').on('blur', '[empty]', this.CheckEmptyInput);

        $(document).on('change', '#page-size', this.loadData.bind(this));
        $(document).on('keyup', '#page-index', this.GetPaging.bind(this));
        $(document).on('click', '#first-page', this.FirstPage.bind(this));
        $(document).on('click', '#prev-page', this.PrevPage.bind(this));
        $(document).on('click', '#next-page', this.NextPage.bind(this));
        $(document).on('click', '#last-page', this.LastPage.bind(this));

    }

    /**
     * Hàm thực hiện phân trang theo các button first, prev,next,last page
     * Người tạo: PDTue 25/08/2019
     */
    FirstPage() {
        var pageIndex = '1';
        this.GetPagingByIndex(pageIndex);
    }
    LastPage() {
        var data = this.getData().length;
        var currentPageSize = parseInt($('#page-size option:selected').val(), 10);
        var pageIndex = Math.floor(1 + data / currentPageSize);
        if ((data % currentPageSize) != 0) {
            var pageIndex = Math.floor(1 + data / currentPageSize);
        }
        else {
            var pageIndex = Math.floor(data / currentPageSize);
        }

        this.GetPagingByIndex(pageIndex);
    }
    PrevPage() {
        var pageIndex = parseInt($('#page-index').val(), 10) - 1;
        this.GetPagingByIndex(pageIndex);
    }
    NextPage() {
        var pageIndex = parseInt($('#page-index').val(), 10) + 1;
        this.GetPagingByIndex(pageIndex);
    }

    /**
     * Hàm thực hiện phân trang theo pageIndex
     * Người tạo: PDTue 25/08/2019
     */
    GetPagingByIndex(pageIndex) {
        var me = this;
        $('#main-table tbody').empty();
        var pageSize = $('#page-size option:selected').val();
        $.ajax({
            method: 'GET',
            url: '/customers/' + pageIndex + '/' + pageSize,
            success: function (res) {
                var data = res.Data;
                var fields = $('#main-table th[fieldName]');
                var target = '#main-table tbody';
                var id = 'CustID';
                me.bindingTableData(fields, data, target, id);
                $('#page-index').val(pageIndex);
                me.SetStatusFooter();
                me.SetStatusToolbar();
            }
        });
    }

    /**
     * Hàm thực hiện phân trang
     * Người tạo: PDTue 25/08/2019
     */
    GetPaging(event) {
        var me = this;

        if (event.keyCode === 13) {
            $('#main-table tbody').empty();
            me.SetStatusFooter();
            var pageIndex = $('#page-index').val();
            var pageSize = $('#page-size option:selected').val();
            var lenght = this.getData().length;
            var currentPageSize = parseInt($('#page-size option:selected').val(), 10);
            var maxPage;
            //var maxPage = Math.floor(1 + lenght / currentPageSize);
            if ((lenght % currentPageSize) != 0) {
                 maxPage = Math.floor(1 + lenght / currentPageSize);
            }
            else {
                 maxPage = Math.floor(lenght / currentPageSize);
            }
            
            if (pageIndex > maxPage) { pageIndex = maxPage; }
            
            $.ajax({
                method: 'GET',
                url: '/customers/' + pageIndex + '/' + pageSize,
                success: function (res) {
                    var data = res.Data;
                    var fields = $('#main-table th[fieldName]');
                    var target = '#main-table tbody';
                    var id = 'CustID';
                    me.bindingTableData(fields, data, target, id);
                    $('#page-index').val(pageIndex);
                    me.SetStatusFooter();
                    me.SetStatusToolbar();

                }
            });
        }
    }

    /**
     * Hàm lấy dữ liệu của khách hàng theo id
     * Người tạo: PDTue 23/08/2019
     * */
    GetCustById(id) {
        var fakeData = [];
        $.ajax({
            method: 'GET',
            url: '/customers/' + id,
            dataType: 'json',
            async: false,
            success: function (res) {
                if (res.Success) {
                    fakeData = res.Data;
                } else {
                    alert(res.Message);
                }
            }
        });
        return fakeData;
    }
    /**
     * Hàm check sự thay đổi trong các dialog
     * Người tạo: PDTue 25/08/2019
     * */
    CheckChangeDialog(method) {

        var me = this;
        var oldData = [];
        var currentData = [];
        var listPropertyName = [];

        // Lấy data trên dialog
        var inputs = $('#dialog input');
        var textarea = $('#dialog textarea');
        var div = $('#dialog textarea');
        $.each(inputs, function (index, item) {
            var propertyName = item.getAttribute('property');
            var propertyValue = $(this).val();
            currentData[propertyName] = propertyValue;
            listPropertyName.push(propertyName);
        });
        $.each(textarea, function (index, item) {
            var propertyName = item.getAttribute('property');
            var propertyValue = $(this).val();
            currentData[propertyName] = propertyValue;
            listPropertyName.push(propertyName);
        });
        listPropertyName.push('CustType');
        var t = $('#dialog #checkType');
        var c = t[0].className;
        if (c == "check") {
            currentData['CustType'] = true;
        } else if (c == "uncheck") {
            currentData['CustType'] = false;
        } else currentData['CustType'] = "";

        // Lấy data trong database
        var rowSelected = $('tbody tr.row-selected');
        var id = rowSelected.data('recordid');
        if (method == "PUT") {
            oldData = me.GetCustById(id);
            $.each(listPropertyName, function (index, item) {
                if (item == "CustDOB") {
                    var date = new Date(oldData[item]);
                    oldData[item] = date.formatddMMyyyy();
                }
            });
        } else if (method == "POST") {
            $.each(listPropertyName, function (index, item) {
                oldData[item] = "";
            });
        }

        //check sự thay đổi
        var check = [];
        $.each(listPropertyName, function (index, item) {
            if (currentData[item].toString() != oldData[item].toString()) { check = false; return false }
            else { check = true };
        });
        return check;
    }

    /**
     * Hàm thực hiện chức năng mở dialog submit sau khi dữ liệu thay đổi ở các dialog cất, thêm
     * Người tạo: PDTue 25/08/2019
     * */
    SubmitCancel() {
        var method = arguments[0].data['method'];
        var check = this.CheckChangeDialog(method);
        if (check == true) {

            this.CloseDialog('#dialog');
        } else {
            $('#dialog').dialog('open');
            if (method == 'POST') {

                this.OpenDialog("dialog-submit-add", "CUKCUK-Quản lý nhà hàng", 125, 400, '#dialog-delete');
                $('#question-delete').empty();
                var items = '<div>Dữ liệu đã thay đổi bạn có muốn cất không?</div>';
                $('#question-delete').append(items);
                $('#btnDeleteNo').removeClass('box-hidden');
            }
            else if (method == 'PUT') {

                this.OpenDialog("dialog-submit-edit", "CUKCUK-Quản lý nhà hàng", 125, 400, '#dialog-delete');
                $('#question-delete').empty();
                var items = '<div>Dữ liệu đã thay đổi bạn có muốn cất không?</div>';
                $('#question-delete').append(items); 
                $('#btnDeleteNo').removeClass('box-hidden');
            }
        }

    }

    /**
     * Hàm thực hiện refersh lại trang
     * Người tạo: PDTue 24/08/2019
     * */
    ReloadPage() {
        var me = this;
        var loadDataOnTable = '<div class="box-loadData"><div class="box-loading">Loading ...</div></div >';
        $('.master-detail').append(loadDataOnTable);
        me.loadData();
        setTimeout(function () {
            $('div').remove('.box-loadData');
        }, 1000);
    }

    /**
     * Hàm thực hiện thêm chức năng cất và thêm
     * Người tạo: PDTue 24/08/2019
     */
    SaveAddCust(event) {
        var me = this;

        var method = arguments[0].data['method'];
        var mode = 1;
        this.SaveCust(method, mode);
    }

    /**
     * Hàm chỉ thực hiện chức năng thêm
     * Người tạo: PDTue 24/08/2019
     */
    OnlySaveCust(event) {
        var me = this;
        var method = arguments[0].data['method'];
        var mode = 0;
        this.SaveCust(method, mode);
    }
    /**
     * Hàm thực hiện thêm và sửa khách hàng
     * Người tạo: PDTue 24/08/2019
     * */
    SaveCust(method, mode) {
        var me = this;
        var x = $('#dialog');
        var selector = x.selector;
        if (!this.CheckEmptyDialog(selector)) {

            var inputs = $('#dialog input');
            var textarea = $('#dialog textarea');
            var object = {};
            $.each(inputs, function (index, item) {
                var propertyName = item.getAttribute('property');
                var propertyValue = $(this).val();
                if (propertyName == 'CustDOB' && $(item).val() == "") {
                    propertyValue = "2000-10-10";
                }
                object[propertyName] = propertyValue;
            });
            $.each(textarea, function (index, item) {
                var propertyName = item.getAttribute('property');
                var propertyValue = $(this).val();
                object[propertyName] = propertyValue;
            });

            if (method == 'POST') {
                object['CustCheckMember'] = true;
                object['CustType'] = false;
            } else if (method == 'PUT') {
                var t = $('#dialog #checkType');
                var c = t[0].className;
                if (c == "check") {
                    object['CustType'] = true;
                } else {
                    object['CustType'] = false;
                }
            }
            var listID = [];

            var fakeData = me.getData();
            $.each(fakeData, function (index, item) {
                listID.push(item['CustID'])
            });
            if ((listID.includes(object['CustID'])) && method == 'POST') {
                alert("Trùng ID Khách hàng");
            } else {
                $.ajax({
                    method: method,
                    url: '/customers',
                    data: JSON.stringify(object),
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {

                        $('#dialog').dialog('close');
                        if ($('#dialog-delete').parents('.ui-dialog:visible').length) { // check dialog submit có mở hay không

                            $('#dialog-delete').dialog('close');
                        }

                        me.loadData();
                        if (mode == 1) { // Nếu chọn SaveAdd thì mở 1 dialog thêm mới
                            me.ShowDialogAdd();
                        }
                    },
                    error: function (res) {
                        alert(res.Message);
                    }
                });
            }
        }
        else {
            
            if ($('#dialog-delete').parents('.ui-dialog:visible').length) {
                // check dialog submit có mở hay không
                $('#dialog-delete').dialog('close');
            }

        }

    }


    /**
     * Hàm thực hiện xóa khách hàng
     * Người tạo: PDTue 24/08/2019
     * */
    DeleteCusts() {
        var me = this;
        var listRowSelected = $('tbody tr.row-selected');

        var listID = [];
        $.each(listRowSelected, function (index, item) {
            listID.push($(item).data('recordid'));
        });
        $.ajax({
            method: 'DELETE',
            url: '/customers',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(listID),
            success: function (res) {
                $('#dialog-delete').dialog('close');
                me.loadData();

            },
            error: function (res) {
                alert(res.Message);
            }
        });

    }



    /**
     * Hàm thực hiện chọn hàng trong bảng
     * Người tạo : PDTue 24/08/2019
     * */
    RowOnClick(event) {
        var tr = this;
        var me = arguments[0].data['jsObject'];
        if (event.ctrlKey) {
        if (tr.className == 'row-selected') {
            $(tr).removeClass('row-selected');
        }
        else {
            $(tr).addClass('row-selected');
        }
        //var me = arguments[0].data['jsObject'];
        me.SetStatusToolbar();
        } else {
            $('tbody tr').removeClass('row-selected');
            $(tr).addClass('row-selected');
            me.SetStatusToolbar();
        }

    }

    ///**
    // * Hàm thực hiện mở dialog submit Cancel
    // * Người tạo: PDTue 25/08/2019
    // * */
    //ShowDialogSubmitCancel() {
    //    debugger
    //    var me = this;
    //    $('#question-delete').empty();
    //    me.OpenDialog("dialog-submit", "CUKCUK-Quản lý nhà hàng", 125, 400, '#dialog-delete');
    //    var items = '<div>Dữ liệu đã thay đổi, bạn có muốn cất không?</div>';
    //    $('#question-delete').append(items);
    //    $('#btnDeleteNo').removeClass('box-hidden');
    //}

    /**
     * Hàm thực hiện mở dialog xóa khách hàng
     * Người tạo: PDTue 22/08/2019
     * */
    ShowDialogDelete() {
        
        var me = this;
        $('#question-delete').empty();
        var items = '';
        me.OpenDialog("dialog-delete", "CUKCUK-Quản lý nhà hàng", 125, 400, '#dialog-delete');
        var rowSelected = $('tbody tr.row-selected');
        if (rowSelected.length == 1) {

            var id = rowSelected.data('recordid');
            var data = [];
            $.ajax({
                method: 'GET',
                url: '/customers/' + id,
                contentType: "application/json; charset=utf-8",
                success: function (res) {

                    data = res.Data;
                    items = '<div>Bạn có chắc chắn muốn xóa Khách hàng << ' + data.CustID + '-' + data.CustName + ' >> không? </div>';

                    $('#question-delete').append(items);
                },

            });

        } else {
            items = '<div>Bạn có chắc chắn muốn xóa các khách hàng này không?</div>';
        }
        $('#question-delete').append(items);
        $('#btnDeleteNo').addClass('box-hidden');
    }

    /**
     * Hàm thực hiện mở dialog thêm mới khách hàng
     * Người tạo: PDTue 22/08/2019
     * */
    ShowDialogAdd() {
        var me = this;
        $('#dialog input').val("");
        $('#dialog textarea').val("");
        me.OpenDialog("dialog-add", "Khách hàng", 352, 675, '#dialog');
        $('#InputCustID').prop("disabled", false);
        $('#CustType #checkType').removeClass("check");
        $('#CustType #checkType').removeClass("uncheck");
        $('#CustType').addClass('hidden');
    }

    /**
     * Hàm thực hiện mở dialog sửa khách hàng
     * Người tạo: PDTue 24/08/2019
     * */
    ShowDialogEdit() {
        var me = this;
        me.OpenDialog("dialog-edit", "Khách hàng", 352, 675, '#dialog');
        $('#CustType').removeClass('hidden');
        $('#InputCustID').prop("disabled", true);
        $('#box-ID .box-danger').addClass('box-hidden');
        $('#box-ID .box-input').removeClass('box-input-warning');
        me.BindingDataDialog();
    }
    /**
     * Hàm thực hiện thay đổi trạng thái khi kích vào nút check-uncheck
     * Người tạo: PDTue 24/08/2019
     * */
    ChangeStatusCheck() {
        var me = this;
        if (me.className == "check") {
            $('#checkType').removeClass("check");
            $('#checkType').addClass("uncheck");
        }
        else {
            $('#checkType').removeClass("uncheck");
            $('#checkType').addClass("check");
        }

    }

    /**
     * Hàm thực hiện bind dữ liệu tương ứng vào các ô nhập liệu trong dialog
     * Người tạo: PDTue 24/08/2019
     * */
    BindingDataDialog() {
        var rowSelected = $('tbody tr.row-selected');
        var id = rowSelected.data('recordid');
        var data = [];
        data = this.GetCustById(id);
        var fields = $('#dialog input[property]');
        var textarea = $('#dialog textarea[property]');
        var div = $('#dialog div[property]');
        $.each(div, function (index, item) {

            var propertyName = item.getAttribute('property');
            var type = data[propertyName];
            if (type == true) {

                $('#checkType').removeClass('uncheck');
                $('#checkType').addClass('check');
            } else {

                $('#checkType').removeClass('check');
                $('#checkType').addClass('uncheck');
            }
        });
        $.each(fields, function (index, item) {
            var propertyName = item.getAttribute('property');
            if (propertyName == "CustDOB") {
                var date = data[propertyName];
                date = new Date(date);
                date = date.formatddMMyyyy();
                $(this).val(date);
            }
            else {
                $(this).val(data[propertyName]);
            }
        });
        $.each(textarea, function (index, item) {
            var propertyName = item.getAttribute('property');
            $(this).val(data[propertyName]);
        });


    }

    /**
     * Hàm thực hiện mở các dialog
     * Người tạo: PDTue 22/08/2019
     * */

    OpenDialog() {
        var me = this;
        var cls = arguments[0];
        var title = arguments[1];
        var height = arguments[2];
        var width = arguments[3];
        var dialog = arguments[4];
        var mode = arguments[5];
        $(dialog).dialog({
            modal: true,
            height: height,
            width: width,
            resizable: false,
            dialogClass: cls,
            title: title,
            close: function () {
                //$(dialog).dialog(mode);
            }
        });
    }

    /**
    * Hàm thực hiện đóng dialog
    * Người tạo: PDTue 24/08/2019
    * */
    CloseDialog() {
        var selector = arguments[0];
        $(selector + ' .box-input').removeClass('box-input-warning');
        $(selector + ' .box-danger').addClass('box-hidden');
        $(selector).dialog('close');
    }

    /**
     * Hàm kiểm tra input có để trống không
     * Người tạo: PDTue 25/08/2019
     * */
    CheckEmptyInput() {
        var value = $(this).val();
        var divInput = this.parentElement;
        var divWarning = divInput.parentElement.children[1];
        if (value) {
            $(divWarning).addClass('box-hidden');
            $(divWarning).removeAttr('title');
            $(divInput).removeClass('box-input-warning');
        } else {
            $(divWarning).removeClass('box-hidden');
            $(divWarning).attr('title', 'Trường này không được để trống!');
            $(divInput).addClass('box-input-warning');
        }
    }

    /**
     * Hàm kiểm tra các ô input bắt buộc còn trống không trước khi xác nhận
     * Người tạo: PDTue 25/08/2019
     * */
    CheckEmptyDialog() {
        var selector = arguments[0];
        var emptys = $(selector + ' [empty]');
        $.each(emptys, function (index, item) {
            $(item).trigger('blur');
        });
        var check = $(selector + ' .box-input-warning').length;
        if (check == 0) {
            return false;
        } else {
            return true;
        }
    }

}

var custJS = new Cust();