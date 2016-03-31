var categories = [];
var contacts = [];
$(document).ready(function () {
    $("#addContact").submit(function () {
        var name = $("#name").val();
        var email = $("#email").val();
        var phoneNumber = $("#phoneNumber").val();
        var company = $("#company").val();
        var category = $("#category").val();
        var id = $("#id").val();
        var contact = {name: name, email: email, phoneNumber: phoneNumber, company: company, id: id, category: category};
        contacts.push(contact);
        listContacts(contacts);
        $("#createModal").modal('hide');
        return false;
    });
    $("#categoryFilter").change(function () {
        var id = $(this).val();
        var contactList = id ? $.grep(contacts, function (e) {
            return e.category == id;
        }) : contacts;
        listContacts(contactList);
    })
    $("#search").keyup(function () {
        var categoryId = $("#categoryFilter").val();
        var contactList = categoryId ? $.grep(contacts, function (e) {
            return e.id == categoryId;
        }) : contacts
        var text = $.trim($(this).val());
        contactList = text.length > 0 ? $.grep(contactList, function (e) {
            return ((e.name.indexOf(text) > -1) || (e.email.indexOf(text) > -1) || (e.phoneNumber.indexOf(text) > -1) || (e.company.indexOf(text) > -1))
        }) : contactList
        listContacts(contactList);
    })
    updateCategoriesSelect();
});

function listContacts(list) {
    var data = "";
    if (list.length > 0) {
        $.each(list, function (index, contact) {
            data += "<tr><td>";
            data = data + contact.name + "</td><td>";
            data = data + contact.email + "</td><td>";
            data = data + contact.phoneNumber + "</td><td>";
            data = data + contact.company + "</td><td>";
            data = data + getCategoryName(contact.category) + "</td>";
            data = data + "<td><a href='javascript:void(0)' onclick='edit(" + contact.id + ")'><i class='fa fa-edit'></i>&nbsp;</a>" +
                "<a href='javascript:void(0)' onclick='removeContact(" + contact.id + ")'> <i class='fa fa-trash'></i></a></td></tr>";
        })
    } else {
        data = "<tr class='noContacts'><td colspan='6'>No contacts found</td></tr>"
    }
    $("#contacts tbody").html(data);

}

function edit(id) {
    var contact = findContactById(id)
    $("#name").val(contact.name);
    $("#email").val(contact.email);
    $("#phoneNumber").val(contact.phoneNumber);
    $("#company").val(contact.company);
    $("#id").val(contact.id);
    $("#category").val(contact.category);
    $("#createModal").modal('show');
}

function create() {
    $("#addContact").find("input[type=text], input[type=email]").val("");
    $("#id").val(contacts.length + 1)
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
            updateCategoriesSelect();
        }
    } else {
        bootbox.alert("Please enter some value");
    }
}

function listCategories() {
    var content = '';
    if (categories.length > 0) {
        $.each(categories, function (index, category) {
            content += "<tr><td><div class='input-group input-group-sm'><input class='form-control' type='text' value='" + category.name + "' id='category_" + category.id + "'/> " +
                " <span class='input-group-btn'> " +
                "<button type='button' class='btn btn-success btn-flat' onclick='updateCategory(" + category.id + ")'><i class='fa fa-save'></i></button>" +
                "<button type='button' class='btn btn-danger btn-flat' onclick='deleteCategory(" + category.id + ")'><i class='fa fa-trash'></i></button>" +
                " </span></div> </td></tr>";
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
                updateCategoriesSelect();
                listContacts(contacts);
            }
        }
    })
}

function updateCategory(id) {
    var name = $.trim($("#category_" + id).val());
    var category = $.grep(categories, function (e) {
        return e.id == id;
    })[0]

    if (name) {
        category.name = name
        var index = categories.findIndex(function (obj) {
            return obj.id == id
        })
        if (index >= 0) {
            categories.splice(index, 1, category);
            updateCategoriesSelect();
            listContacts(contacts);
        }
    } else {
        bootbox.alert('Please enter some value');
        $("#category_" + id).val(category.name)
    }
}

function updateCategoriesSelect() {
    var content = '<option value="">Select category</option>'
    if (categories.length > 0) {
        content += $.map(categories, function (obj, index) {
            return "<option value='" + obj.id + "'>" + obj.name + "</option>"
        }).join("")
    }
    $("#categoryFilter").html(content)
    $("#category").html(content)
}

function getCategoryName(id) {
    var category = $.grep(categories, function (e) {
        return e.id == id;
    })[0]
    return category ? category.name : ''
}

function findContactById(id) {
    return $.grep(contacts, function (e) {
        return e.id == id;
    })[0]
}