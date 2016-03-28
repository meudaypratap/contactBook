var contacts = [];

$(document).ready(function () {
    $("#addContact").submit(function () {
        var name = $("#name").val();
        var email = $("#email").val();
        var phoneNumber = $("#phoneNumber").val();
        var company = $("#company").val();
        var contact = {name: name, email: email, phoneNumber: phoneNumber, company: company};
        contacts.push(contact);
        show(contact);
        $("#createModal").modal('hide');
    })
});

function show(contact) {
    $('.noData').remove();
    var data = "<tr><td>";
    data = data + contact.name + "</td><td>";
    data = data + contact.email + "</td><td>";
    data = data + contact.phoneNumber + "</td><td>";
    data = data + contact.company + "</td>";
    data = data + "<td><a href='javascript:void(0)' data-toggle='modal' data-target='#createModal'><i class='fa fa-edit'></i>&nbsp;</a> <a href='javascript:void(0)'>" +
        " <i class='fa fa-trash'></i></a></td></tr>";
    $("#contacts tbody").append(data);
}