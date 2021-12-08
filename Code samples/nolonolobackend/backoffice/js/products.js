let prodName;

function sendRent()
{
 let email = $('#email').val();
 let start = $('#start').val();
 let end = $('#end').val();


 let obj = `{
    "name": "${prodName}",
    "email": "${email}",
    "start": "${start}",
    "end": "${end}"
}`;
console.log(obj);
$.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/makeRental',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(data)
    {
        $('#content').html(data.message);
    }).fail(function(data)
    {
        $('#content').html(data.message);

    })

}

function showAddRent(x, products)
{
    prodName = products[x].name;
    toInsert = `
    <input class="form-control" type="text" value="${prodName}" aria-label="readonly input example" readonly>
    <div class="mb-3">
    <label for="email" class="form-label">User Email</label>
    <input type="email" class="form-control" id="email">
  </div>
  <div class="mb-3">
  <label for="start">Start:</label>
  <input type="date" id="start" name="start">
  <label for="end">End:</label>
  <input type="date" id="end" name="end">
    </div>
    <button class="btn btn-outline-primary " type="button" onclick="sendRent()">Rent</button>
    `
    $('#content').html(toInsert);
}