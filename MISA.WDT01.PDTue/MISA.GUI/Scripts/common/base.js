class Base {
    constructor() {

    }
    getData() {
        var fakeData = [];
        $.ajax({
            method: 'GET',
            url: '/customers',
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

    getDataByPage() {

        var fakeData = [];
        var pageIndex = $('#page-index').val();
        var pageSize = $('#page-size option:selected').val();
        $.ajax({
            method: 'GET',
            url: '/customers/{0}/{1}'.format(pageIndex, pageSize),
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

    loadData() {
        var me = this;
        var data = [];
        me.SetStatusFooter();
        var pageIndex = $('#page-index').val();
        var pageSize = $('#page-size option:selected').val();

        $.ajax({
            method: 'GET',
            url: '/customers/{0}/{1}'.format(pageIndex, pageSize),
            dataType: 'json',
            async: false,
            success: function (res) {
                if (res.Success) {

                    data = res.Data;
                    var fields = $('#main-table th[fieldName]');
                    var target = '#main-table tbody';
                    var id = 'CustID';
                    me.bindingTableData(fields, data, target, id);
                    me.SetStatusToolbar();
                    me.SetStatusFooter();
                } else {
                    alert(res.Message);
                }
            }
        });

    }

    /**
     * Hàm cập nhật trạng thái cho thanh toolbar sửa
     * Người tạo: PDTue 24/08/2019
     */
    SetStatusToolbar() {
        var rowSelected = $('tbody tr.row-selected').length;

        if (rowSelected != 0) {

            $('#btnToolDelete').removeClass('toolbar-button-disabled');
            if (rowSelected == 1) {
                $('#btnToolEdit').removeClass('toolbar-button-disabled');
                $('#btnToolDuplicate').removeClass('toolbar-button-disabled');
            } else {
                $('.master-toolbar #btnToolEdit').addClass('toolbar-button-disabled');
                $('.master-toolbar #btnToolDuplicate').addClass('toolbar-button-disabled');
            }
        } else {
            $('#btnToolEdit').addClass('toolbar-button-disabled');
            $('#btnToolDelete').addClass('toolbar-button-disabled');
            $('#btnToolDuplicate').addClass('toolbar-button-disabled');
        }
    }

    /**
     * Hàm set trạng thái cho các footer button
     * Người tạo: PDTue 25/08/2019
     */
    SetStatusFooter() {
        var data = this.getData().length;
        var currentPageSize = parseInt($('#page-size option:selected').val(), 10);
        var currentPageIndex = parseInt($('#page-index').val(), 10);
        if (currentPageIndex <= 0) { currentPageIndex = 1; }
        var maxPage;
        if ((data % currentPageSize) != 0) {
            maxPage = Math.floor(1 + data / currentPageSize);

        }
        else {
            maxPage = Math.floor(data / currentPageSize);
        }

        if (maxPage == 1) {
            $('#page-index').val(maxPage);
            $('#first-page').addClass('toolbar-button-disabled');
            $('#prev-page').addClass('toolbar-button-disabled');
            $('#next-page').addClass('toolbar-button-disabled');
            $('#last-page').addClass('toolbar-button-disabled');
        }
        else {
            if (currentPageIndex == 1) {

                $('#page-index').val(currentPageIndex);
                $('#first-page').addClass('toolbar-button-disabled');
                $('#prev-page').addClass('toolbar-button-disabled');
                $('#next-page').removeClass('toolbar-button-disabled');
                $('#last-page').removeClass('toolbar-button-disabled');
            } else if (currentPageIndex >= maxPage) {
                $('#page-index').val(maxPage);
                $('#next-page').addClass('toolbar-button-disabled');
                $('#last-page').addClass('toolbar-button-disabled');
                $('#first-page').removeClass('toolbar-button-disabled');
                $('#prev-page').removeClass('toolbar-button-disabled');
            } else {
                $('#first-page').removeClass('toolbar-button-disabled');
                $('#prev-page').removeClass('toolbar-button-disabled');
                $('#next-page').removeClass('toolbar-button-disabled');
                $('#last-page').removeClass('toolbar-button-disabled');
            }
        }




        $('#total-page').empty();
        $('#total-page').append(maxPage);

        $('#first-result').empty();
        $('#first-result').append((currentPageIndex - 1) * currentPageSize + 1);

        $('#last-result').empty();
        if (currentPageIndex < maxPage) {
            $('#last-result').append(currentPageIndex * currentPageSize);
        }
        else {
            $('#last-result').append(data);
        }

        $('#total-result').empty();
        $('#total-result').append(data);

    }

    /**
     * Thực hiện bind data vào bảng
     * Người tạo: PDTue 22/08/2019
     */
    bindingTableData(fields, data, target, id) {
        $(target).empty();
        $.each(data, function (index, item) {
            var rowHTML = $('<tr></tr>').data("recordid", item[id]);
            $.each(fields, function (fieldIndex, fieldItem) {
                var fieldName = fieldItem.getAttribute('fieldName');
                var fieldValue = item[fieldName];
                var cls = 'text-left';
                if (fieldName == "CustDOB") {
                    fieldValue = new Date(fieldValue);
                } else if (fieldName == "CustOwe") {
                    fieldValue = fieldValue.formatMoney();
                }

                switch (fieldName) {
                    case "CustOwe":
                        cls = 'text-right';
                        break;
                    //case "CustID":
                    //case "CustPhonenumber":
                    //case "TaxNumber":
                    //    cls = 'text-center';
                    //    break;
                }

                //var type = $.type(fieldValue);
                //switch (type) {
                //    //case "number":
                //    //    fieldValue = fieldValue.formatMoney();
                //    //    cls = 'text-right';
                //    //    break;
                //    case "date":
                //        fieldValue = fieldValue.formatddMMyyyy();
                //        cls = 'text-center';
                //        break;
                //}
                if (fieldName == "CustCheckMember") {
                    if (item[fieldName] == true) {
                        rowHTML.append('<td class = "{0}"></td>'.format("check"));
                    } else {
                        rowHTML.append('<td class = "{0}"></td>'.format("uncheck"));
                    }
                } else if (fieldName == "CustType") {
                    if (item[fieldName] == true) {
                        rowHTML.append('<td class = "{0}"></td>'.format("check"));
                    } else {
                        rowHTML.append('<td class = "{0}"></td>'.format("uncheck"));
                    }
                } else if ((fieldName != 'CustOwe') && (fieldValue == 0)) {
                    rowHTML.append('<td class = ""></td>');
                }
                else {
                    rowHTML.append('<td class = "{1}">{0}</td>'.format(fieldValue, cls));
                }
            });
            $(target).append(rowHTML);
        });
    }

    //Thực hiện format lại định dạng tiền khi người dùng nhập liệu vào ô input "Số tiền"
    //Người tạo VDThang29/07/2019
    FomartCurrency() {
        $(this).attr('maxlength', '14');
        $(this).val(formatCurrency(this.value.replace(/[.]/g, '')));
        var valueInput = $(this).val();
        //Nếu đầu chuỗi là số 0 thì thực hiện loại bỏ
        if (valueInput.length >= 2 && valueInput[0] == "0" && valueInput[1] != "0" && valueInput[1] != ".") {
            $(this).val(this.value.substring(1, this.value.length));
        }
        //Không cho người dùng nhập ký tự khác ký tự số
        $(this).keypress(function (e) {
            if (!$.isNumeric(String.fromCharCode(e.which))) {
                $(this).val(this.value.substring(0, this.value.length));
                e.preventDefault();
            }
        }).on('paste', function (e) {
            //Không cho người dùng paste các giá trị khác kiểu số
            var cb = e.originalEvent.clipboardData || window.clipboardData;
            if (!$.isNumeric(cb.getData('text'))) e.preventDefault();
        });
        //Nếu người dùng xóa hết thì để giá trị mặc định là 0
        if (valueInput == "") {
            $(this).val("0");
        }
    }
}