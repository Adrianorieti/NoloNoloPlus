let prodName;
/** Refresh page */
function reset()
{
  location.reload();
}

function sendRent()
{
  let employee = sessionStorage.getItem('email');
 let email = $('#email').val();
 let start = $('#start').val();
 let end = $('#end').val();


 let obj = `{
    "name": "${prodName}",
    "employee": "${employee}",
    "email": "${email}",
    "start": "${start}",
    "end": "${end}"
}`;

console.log("PORCODDIO", obj);

$.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/makeRental',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(data)
    {
        $('#content').html("succesful operation");
    }).fail(function(data)
    {
        $('#content').html("Error product is unavailable or mail incorrect");
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
    $('#title').html("");
    $('#content').html(toInsert);
}

function sendProduct(event)
{
    event.preventDefault();
    let name = $('#name').val();
    let price = $('#price').val();
    let status = $('#status').val();
    let category =$('#category').val();
    if(!name || !price)
        $('#error').html("Please insert all fields");
    else
    {
        let obj = `{
            "name": "${name}",
            "price": "${price}",
            "status": "${status}",
            "category": "${category}"
          }`
          $.post({
            type: 'POST',
              url: 'http://localhost:8001/api/employee/addProduct',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              data: obj
            }, function(){
                $('#add').html("Successful added");
            }).fail(function(){
                $('#add').html("Error, maybe the element already exists");

            })
    }
}
/** Creates the add product's form */
function showAddProduct()
{
    let toInsert = `
    <form onsubmit="sendProduct(event)" class="needs-validation">
    <div class="mb-3">
    <label for="name" class="form-label">Name</label>
    <input type="text" class="form-control" id="name" aria-describedby="nameHelp">
  </div>
  <div class="input-group mb-3">
  <label class="input-group-text" for="category">Category</label>
  <select class="form-select" id="category">
    <option selected>Special Bike</option>
    <option value="Mountain Bike">Mountain Bike</option>
    <option value="City Bike">City Bike</option>
    <option value="Scooter">Scooter</option>
    <option value="Electric S_300">Electric S_300</option>
  </select>
</div>
<div class="input-group mb-3">
<label class="input-group-text" for="status">Status</label>
<select class="form-select" id="status">
  <option selected value="New">New</option>
  <option value="Broken">Broken</option>
  <option value="Used">Used</option>
</select>
</div>
<div class="input-group mb-3">
<label class="input-group-text" for="price">Price</label>
  <span class="input-group-text">€</span>
  <input type="text" class="form-control" id="price" aria-label="Amount (to the nearest euro)">
  <span class="input-group-text">.00</span>
</div>
<span id="error"></span> <br>
<button type="submit" class="btn btn-lg btn-primary btn-block" >Add product</button>
<button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()" >Close</button>
</form>

    `;
    $('#title').html("");
    $('#content').html(toInsert);

}

function sendChange()
{
  let name = $('#oldname').val();
  let field = $('#changeMenu').val();
  let newValue = $('#newValue').val();
  console.log(name);
  console.log(field);
  console.log(newValue);

  const obj = `{
    "name": "${name}",
    "type": "${field}",
    "data": "${newValue}"
  }`;

  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/updateProduct',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(data){
        $('#change').html(data.message);
    }).fail(function(data){
        $('#change').html(data.message);
    })
  
}

/** Show the area when the employee can change a product field */
function showChangeProduct(x, products)
{
  toInsert = `
  <div class="input-group mb-3">
  <input class="form-control" type="text" id='oldname' value="${products[x].name}" aria-label="readonly input example" readonly></div>
  <div class="input-group mb-3">
  <label class="input-group-text" for="changeMenu">Field</label>
  <select class="form-select" id="changeMenu">
    <option selected value="name">Name</option>
    <option value="type">Type</option>
    <option value="status">Status</option>
    <option value="price">Price</option>
  </select>
</div>
<div class="mb-3">
  <label for="newValue" class="form-label">New value</label>
  <input type="text" class="form-control" id="newValue">
</div>
<span id="changeErr"></span>
<button class="btn btn-outline-primary " type="button" onclick="sendChange()" >Confirm</button>
<button class="btn btn-outline-warning" type="button" onclick="reset()" >Close</button>

  `
  $('#title').html("");

  $('#content').html(toInsert);
}

/** TODO GESTIRE GRAFICAMENTE LA LISTA DI RESERVATIONS RITORNATA DAL SERVER QUANDO CANCELLIAMO IL PRODOTTO */
function sendDelete()
{
  let toDelete = $('#product').val();
  console.log(toDelete);
  const obj =`{
    "name": "${toDelete}"
  }`
  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/deleteProduct',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(){
        $('#delete').html("Successful deletion");
    }).fail(function(){
        $('#delete').html("Error, maybe the element doesn't exists");
    })
}

/** Chiediamo al server tutti i prodotti e li mettiamo in un select per il dipendente così può cancellarli */
function showDeleteProduct(x, products)
{
    
     let toInsert = `
     <input class="form-control" type="text" id="product" value="${products[x].name}" aria-label="readonly input example" readonly>
      `
      toInsert += `</select></div>
      <button type="button" class="btn btn-lg btn-danger btn-block" onclick="sendDelete()" >Confirm Deletion</button>
      <button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()" >Close</button>`;
      $('#title').html("");
      $('#content').html(toInsert);
}

function sendMaintenance()
{
  let name = $('#name').val();
  let start = $('#start').val();
  let end = $('#end').val();

  const obj =`{
    "name": "${name}",
    "start": "${start}",
    "end": "${end}"
  }`;

  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/maintenance',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(data){
        if(data.message)
          $('#content').html(`<div style='background-color:lightgreen; text-align:center;color:black;'>${data.message}</div>`);
        else if(data.list)
        {
          let toInsert = '';
          for(let x in data.list)
          {
            toInsert += `<p><b>Reservation ${x}</b></p>
            <p>From: ${data.list[x].start} </p>
            <p>To: ${data.list[x].end}</p>
            `
          }
          $('#content').html(`<div style='background-color:lightgreen; text-align:center;color:black;'>${toInsert}</div>`);

        }
          // $('#content').html(`<div style='background-color:lightgreen; text-align:center;color:black;'>
          // ${data.message}
          // </div>`);

    }).fail(function(data){
        $('#content').html("Error occurred ,try again later");
    })
  
}
/** Show the mainenance html form */
function showMaintenance(x , products)
{

  let toInsert =`
  <input class="form-control" type="text" id="name" value="${products[x].name}" aria-label="readonly input example" readonly>
  <label for="start">Start:</label>
  <input type="date" id="start" name="start"> 
  <label for="end">End:</label>
  <input type="date" id="end" name="end"> 
  <button type="button" class="btn btn-dark" onclick="sendMaintenance()">Send product to maintenance</button>
  <button type="button" class="btn btn-warning" onclick="reset()">Back</button>

  `
  $('#title').html("");
  $('#content').html(toInsert);
}