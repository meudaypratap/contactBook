var categories = [];

$(document).ready(function () {
    $("#addContact").submit(function () {
        var name = $("#name").val();
        var email = $("#email").val();
        var phoneNumber = $("#phoneNumber").val();
        var company = $("#company").val();
        var index = $("#index").val();
        var contact = {name: name, email: email, phoneNumber: phoneNumber, company: company, index: index};
        show(contact);
        $("#createModal").modal('hide');
        return false;
    })
});

function show(contact) {
    $('.noContacts').hide();
    if (parseInt(contact.index) >= 0) {
        $("#contacts tbody tr:eq(" + contact.index + ") td:eq(0)").text(contact.name);
        $("#contacts tbody tr:eq(" + contact.index + ") td:eq(1)").text(contact.email);
        $("#contacts tbody tr:eq(" + contact.index + ") td:eq(2)").text(contact.phoneNumber);
        $("#contacts tbody tr:eq(" + contact.index + ") td:eq(3)").text(contact.company);
    } else {
        var data = "<tr><td>";
        data = data + contact.name + "</td><td>";
        data = data + contact.email + "</td><td>";
        data = data + contact.phoneNumber + "</td><td>";
        data = data + contact.company + "</td>";
        data = data + "<td><a href='javascript:void(0)' onclick='edit(this)'><i class='fa fa-edit'></i>&nbsp;</a>" +
            "<a href='javascript:void(0)' onclick='removeContact(this)'> <i class='fa fa-trash'></i></a></td></tr>";
        $("#contacts tbody").append(data);
    }
}

function edit(btn) {
    var $row = $(btn).parent().parent();
    var index = $row.index();
    var name = $row.find('td:eq(0)').text();
    var email = $row.find('td:eq(1)').text();
    var phoneNumber = $row.find('td:eq(2)').text();
    var company = $row.find('td:eq(3)').text();
    $("#name").val(name);
    $("#email").val(email);
    $("#phoneNumber").val(phoneNumber);
    $("#company").val(company);
    $("#index").val(index);
    $("#createModal").modal('show');
}

function create() {
    $("#addContact").find("input[type=text], input[type=email]").val("");
    $("#createModal").modal('show');
}

function showCategories() {
    $("#addCategory").find("input[type=text]").val("");
    $("#categoriesModal").modal('show');
    listCategories();
}

function removeContact(btn) {
    var $row = $(btn).parent().parent();
    bootbox.confirm("Are you sure you want to remove this contact", function (result) {
        if (result) {
            $row.remove();
            if ($("#contacts tbody tr").not(".noContacts").length == 0) {
                $('.noContacts').show();
            }
        }
    })
}

function addCategory() {
    var name = $.trim($("#categoryName").val());
    if (name) {
        if ($.inArray(name, getCategoryNames()) >= 0) {
            bootbox.alert("Category already exists");
        } else {
            categories.push({id: getNextCategoryId(), name: name});
            $("#categoryName").val('');
            listCategories();
        }
    } else {
        bootbox.alert("Please enter some value");
    }
}

function listCategories() {
    var content = '';
    if (categories.length > 0) {
        $.each(categories, function (index, category) {
            content += "<tr><td><div class='input-group input-group-sm'><input class='form-control' type='text' value='" + category.name + "'/> " +
                " <span class='input-group-btn'> <button type='button' class='btn btn-danger btn-flat' onclick='deleteCategory(" + category.id + ")'>" +
                " <i class='fa fa-trash'></i></button></span></div> </td></tr>";
        });
    } else {
        content = "<tr><td>No categories found</td></tr>"
    }
    $("#categories tbody").html(content);
}

function getNextCategoryId() {
    var id = 1;
    var ids = getCategoryIds()
    if (ids.length > 0) {
        id = (Math.max.apply(Math, ids) + 1)
    }
    return id
}

function getCategoryNames() {
    return $.map(categories, function (obj, index) {
        return obj.name
    })
}

function getCategoryIds() {
    return $.map(categories, function (obj, index) {
        return parseInt(obj.id)
    })
}

function deleteCategory(id) {
    bootbox.confirm('Are you sure you want to remove this category', function (result) {
        if (result) {
            var index = categories.findIndex(function (obj) {
                return obj.id == id
            })
            if (index >= 0) {
                categories.splice(index, 1)
                listCategories();
            }
        }
    })
}